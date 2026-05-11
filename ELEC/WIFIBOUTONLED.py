import network
import socket
import time
from machine import Pin

# --- Config Wi-Fi ---
SSID = "0001"
PASSWORD = "00000001"

# On garde tes paramètres exacts
led = Pin(0, Pin.OUT)
button = Pin(14, Pin.IN)

# 1. Connexion au Wi-Fi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)

print("Connexion au Wi-Fi...")
while not wlan.isconnected():
    time.sleep(0.5)

ip = wlan.ifconfig()[0]
print(f"Connecté ! Adresse IP : http://{ip}")

# 2. Setup du serveur
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('', 80))
s.listen(5)
s.settimeout(0.1) # Permet de ne pas bloquer ta boucle "while True"

print("Programme prêt !")

while True:
    # --- TON CODE EXACT (ZERO PB) ---
    if button.value() == 1:
        # print("Bouton appuyé !") # Optionnel : peut ralentir un peu le web
        led.value(0) 
        etat_bouton = "APPUYE"
    else:
        led.value(1) 
        etat_bouton = "RELACHE"

    # --- PARTIE RESEAU (S'adapte à ton code) ---
    try:
        try:
            client, addr = s.accept()
        except OSError:
            continue # Personne ne se connecte, on retourne direct au bouton

        request = client.recv(1024)
        
        # Envoi de la page avec rafraîchissement auto toutes les 2 secondes
        html = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n"
        html += "<html><head><meta http-equiv='refresh' content='2'></head>"
        html += f"<body><h1>Etat du bouton : {etat_bouton}</h1>"
        html += "<p>La page s'actualise toute seule.</p></body></html>"
        
        client.send(html)
        client.close()
    except:
        if 'client' in locals():
            client.close()