import network
import socket
import time
from machine import Pin
import utime

# --- CONFIGURATION ---
SSID = "0001"
PASSWORD = "00000001"

led = Pin(0, Pin.OUT)
trig = Pin(15, Pin.OUT)
echo = Pin(14, Pin.IN)

# Setup Bouton (GPIO 2 = VCC, GPIO 1 = Signal, Résistance 470)
vcc_bouton = Pin(2, Pin.OUT)
vcc_bouton.value(1)
bouton = Pin(1, Pin.IN)

# Variables de stockage (Globales)
etat_bouton = "RELACHE"
distance_cm = 0

# --- CONNEXION WI-FI ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)

print("Connexion au Wi-Fi...")
while not wlan.isconnected():
    time.sleep(0.5)

ip = wlan.ifconfig()[0]
print(f"Connecté ! http://{ip}")

# --- SETUP SERVEUR ---
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('', 80))
s.listen(1) # On réduit la file d'attente pour plus de réactivité
s.settimeout(0.05) # Timeout très court pour ne pas bloquer

def mesurer_distance():
    # Signal court pour ne pas bloquer le processeur
    trig.low()
    utime.sleep_us(2)
    trig.high()
    utime.sleep_us(10)
    trig.low()
    
    # Sécurité pour éviter les boucles infinies (timeout interne)
    start = utime.ticks_us()
    while echo.value() == 0:
        if utime.ticks_diff(utime.ticks_us(), start) > 20000: return 0
        pulse_start = utime.ticks_us()
    
    start = utime.ticks_us()
    while echo.value() == 1:
        if utime.ticks_diff(utime.ticks_us(), start) > 20000: return 0
        pulse_end = utime.ticks_us()
        
    return (utime.ticks_diff(pulse_end, pulse_start) * 0.0343) / 2

print("Système stabilisé prêt !")

while True:
    # 1. MISE À JOUR DES DONNÉES (Mesure rapide)
    try:
        # On lit le bouton
        if bouton.value() == 0:
            led.value(1)
            etat_bouton = "RELACHE"
        else:
            led.value(0)
            etat_bouton = "APPUYE"
        
        # On lit la distance (seulement une fois par boucle)
        distance_cm = mesurer_distance()
    except:
        pass

    # 2. RÉPONSE WEB (Si une requête arrive)
    try:
        client, addr = s.accept()
        # On ne lit que le début de la requête pour aller vite
        request = client.recv(512) 
        
        # On prépare la réponse
        html = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n"
        html += "<html><head><meta charset='utf-8'><meta http-equiv='refresh' content='3'></head>"
        html += "<body style='font-family: sans-serif; text-align: center; margin-top: 50px;'>"
        html += f"<h1 style='color: #333;'>Dashboard Pico W</h1>"
        html += f"<div style='border: 2px solid #ccc; padding: 20px; display: inline-block; border-radius: 15px;'>"
        html += f"<p>Bouton : <strong style='color: {'red' if etat_bouton == 'APPUYE' else 'green'};'>{etat_bouton}</strong></p>"
        html += f"<p>Distance : <strong style='color: blue;'>{distance_cm:.1f} cm</strong></p>"
        html += "</div></body></html>"
        
        client.send(html)
        client.close()
    except OSError:
        # Aucune connexion entrante, on continue simplement la boucle
        pass