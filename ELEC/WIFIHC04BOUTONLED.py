import network
import socket
import time
from machine import Pin, time_pulse_us

# --- CONFIGURATION ---
SSID = "Linksys08470"
PASSWORD = "scqx3iiphv"

led = Pin(0, Pin.OUT)
button = Pin(1, Pin.IN, Pin.PULL_UP)

# Capteur de distance HC-SR04
trig = Pin(14, Pin.OUT)
echo = Pin(15, Pin.IN)

def get_distance():
    trig.low()
    time.sleep_us(2)
    trig.high()
    time.sleep_us(10)
    trig.low()
    
    # Mesure la durée de l'impulsion en microsecondes
    duree = time_pulse_us(echo, 1, 30000) # Timeout de 30ms
    if duree < 0:
        return 0
    # Calcul de la distance : (vitesse du son * temps) / 2
    distance = (duree * 0.0343) / 2
    return round(distance, 1)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)

while not wlan.isconnected():
    time.sleep(0.5)

ip = wlan.ifconfig()[0]
print(f"Connecté ! http://{ip}")

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('', 80))
s.listen(5)
s.settimeout(0.1)

while True:
    # Logique Bouton & LED
    valeur_bouton = button.value()
    if valeur_bouton == 0:
        led.value(0) # Allumé
        etat = "APPUYE"
    else:
        led.value(1) # Éteint
        etat = "RELACHE"

    # Lecture Distance
    dist = get_distance()

    try:
        try:
            client, addr = s.accept()
        except OSError:
            continue

        request = client.recv(1024)
        
        response = "HTTP/1.1 200 OK\r\n"
        response += "Content-Type: text/html\r\n"
        response += "Cache-Control: no-cache\r\n"
        response += "Connection: close\r\n\r\n"
        
        html = f"""
        <html>
            <head><meta http-equiv='refresh' content='1'></head>
            <body style='font-family: Arial; text-align: center;'>
                <h1>Tableau de bord Pico W</h1>
                <p style='font-size: 20px;'>Bouton : <strong>{etat}</strong></p>
                <div style='background: #f0f0f0; padding: 20px; border-radius: 10px; display: inline-block;'>
                    <h2>Distance mesuree</h2>
                    <p style='font-size: 40px; color: blue;'>{dist} cm</p>
                </div>
            </body>
        </html>
        """
        
        client.send(response + html)
        client.close()
    except:
        if 'client' in locals(): client.close()