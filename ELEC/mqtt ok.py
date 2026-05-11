import network
import time
from machine import Pin, time_pulse_us
from umqtt.simple import MQTTClient

# --- CONFIG ---
MQTT_BROKER = "10.66.116.44" 
CLIENT_ID = "Pico_Timothee"

led = Pin(0, Pin.OUT)
button = Pin(1, Pin.IN, Pin.PULL_UP)
trig = Pin(14, Pin.OUT)
echo = Pin(15, Pin.IN)

# --- CONNEXION WIFI ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("0001", "00000001")

print("Attente WiFi...")
while not wlan.isconnected(): 
    time.sleep(0.5)
print("WiFi Connecté !")

# --- CONNEXION MQTT ---
# On met un keepalive pour eviter les deconnexions intempestives
client = MQTTClient(CLIENT_ID, MQTT_BROKER, keepalive=60)

def reconnect():
    print("Echec connexion MQTT, tentative de reconnexion...")
    time.sleep(5)
    try:
        client.connect()
    except:
        pass

try:
    client.connect()
    print("Connecté au Broker MQTT !")
except:
    reconnect()

def get_distance():
    trig.low()
    time.sleep_us(2)
    trig.high()
    time.sleep_us(10)
    trig.low()
    duree = time_pulse_us(echo, 1, 30000)
    return round((duree * 0.0343) / 2, 1) if duree > 0 else 0

print("Envoi des donnees vers Mosquitto...")

while True:
    # Logique bouton (Ta base stable)
    valeur_bouton = button.value()
    led.value(0 if valeur_bouton == 0 else 1)
    
    # Lecture distance
    dist = get_distance()
    
    # Envoi au PC
    try:
        # On publie les messages
        client.publish("pico/distance", str(dist))
        client.publish("pico/bouton", "APPUYE" if valeur_bouton == 0 else "RELACHE")
    except Exception as e:
        # Si ca plante (ex: micro-coupure WiFi), on essaie de reconnecter proprement
        print("Erreur d'envoi, reconnexion en cours...")
        try:
            
            print("Ping vers le PC...")
            import os
# Remplace par l'IP de ton PC actuelle
            os.system("ping -c 1 10.66.116.44")
            client.connect()
        except:
            pass
            
    time.sleep(0.5)