import network
import time
from machine import Pin, time_pulse_us
from umqtt.simple import MQTTClient

# --- CONFIG ---
MQTT_BROKER = "10.1.100.143" 
CLIENT_ID = "Pico_Timothee"

led = Pin(0, Pin.OUT)
button = Pin(1, Pin.IN, Pin.PULL_UP)
trig = Pin(14, Pin.OUT)
echo = Pin(15, Pin.IN)

# --- FONCTION CALLBACK MQTT (NOUVEAU) ---
# Cette fonction est appelée automatiquement quand on reçoit un message
def reception_message(topic, msg):
    print("Message reçu sur {}: {}".format(topic, msg))
    
    # umqtt renvoie les messages sous forme de bytes (ex: b"ON")
    if msg == b"ON":
        led.value(1)  # Allume la LED
    elif msg == b"OFF":
        led.value(0)  # Eteint la LED

# --- CONNEXION WIFI ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("Linksys08470", "scqx3iiphv")

print("Attente WiFi...")
while not wlan.isconnected(): 
    time.sleep(0.5)
print("WiFi Connecté !")

# --- CONNEXION MQTT ---
client = MQTTClient(CLIENT_ID, MQTT_BROKER, keepalive=60)

# On associe la fonction callback au client
client.set_callback(reception_message)

def reconnect():
    print("Echec connexion MQTT, tentative de reconnexion...")
    time.sleep(5)
    try:
        client.connect()
        # Il faut se réabonner après une reconnexion
        client.subscribe("pico/led")
    except:
        pass

try:
    client.connect()
    print("Connecté au Broker MQTT !")
    # On s'abonne au topic de la LED
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
        # --- LECTURE DES MESSAGES MQTT ENTRANTS (NOUVEAU) ---
        # Vérifie si le serveur a envoyé "ON" ou "OFF"
        client.check_msg()
        
        # Logique bouton
        valeur_bouton = button.value()
        
        # J'ai désactivé le contrôle direct de la LED par le bouton 
        # pour que MQTT puisse avoir le contrôle.
        # led.value(0 if valeur_bouton == 0 else 1)
        
        # Lecture distance
        dist = get_distance()
        
        # Envoi au PC
        client.publish("pico/distance", str(dist))
        client.publish("pico/bouton", "APPUYE" if valeur_bouton == 0 else "RELACHE")
        
    except Exception as e:
        print("Erreur détectée, reconnexion en cours...")
        try:
            client.connect()
            client.subscribe("pico/led") # Réabonnement vital après coupure
        except:
            pass
            
    time.sleep(0.5)