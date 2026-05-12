import network
import time
from machine import Pin, time_pulse_us
from umqtt.simple import MQTTClient

# --- CONFIG ---
MQTT_BROKER = "172.20.10.2"  # <-- Espace invisible supprimé à la fin
CLIENT_ID = "Pico_Timothee"
NOM_SYSTEME = "Radar_Timothee"  # <-- Ta nouvelle variable pour le nom

led = Pin(0, Pin.OUT)
button = Pin(1, Pin.IN, Pin.PULL_UP)
trig = Pin(14, Pin.OUT)
echo = Pin(15, Pin.IN)

# --- FONCTION CALLBACK MQTT ---
def reception_message(topic, msg):
    print("Message reçu sur {}: {}".format(topic, msg))
    
    if msg == b"ON":
        led.value(1)  # Allume la LED (Active le système)
        print("Système ACTIVÉ")
    elif msg == b"OFF":
        led.value(0)  # Eteint la LED (Désactive le système)
        print("Système DÉSACTIVÉ")

# --- CONNEXION WIFI ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("Iphone 16e", "jesaispas")

print("Attente WiFi...")
while not wlan.isconnected(): 
    time.sleep(0.5)
print("WiFi Connecté !")

# --- CONNEXION MQTT ---
client = MQTTClient(CLIENT_ID, MQTT_BROKER, keepalive=60)
client.set_callback(reception_message)

def reconnect():
    print("Echec connexion MQTT, tentative de reconnexion...")
    time.sleep(5)
    try:
        client.connect()
        client.subscribe("pico/led")
    except:
        pass

try:
    client.connect()
    print("Connecté au Broker MQTT !")
    client.subscribe("pico/led")
    print("Abonné au topic : pico/led")
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
    try:
        # 1. On écoute toujours les messages entrants pour pouvoir allumer/éteindre
        client.check_msg()
        
        # 2. Le système n'envoie les données QUE si la LED est allumée
        if led.value() == 1:
            valeur_bouton = button.value()
            dist = get_distance()
            
            # On intègre le nom du système dans le message envoyé au PC
            message_distance = "{} : {}".format(NOM_SYSTEME, dist)
            
            client.publish("pico/distance", message_distance)
            client.publish("pico/bouton", "APPUYE" if valeur_bouton == 0 else "RELACHE")
        
    except Exception as e:
        print("Erreur détectée, reconnexion en cours...")
        try:
            client.connect()
            client.subscribe("pico/led")
        except:
            pass
            
    time.sleep(0.5)