import network
import time
from machine import Pin, time_pulse_us
from umqtt.simple import MQTTClient

# --- CONFIG ---
MQTT_BROKER = "172.20.10.2"
CLIENT_ID = "Pico_Timothee"
NOM_SYSTEME = "Radar cuisine" 

led = Pin(0, Pin.OUT)
button = Pin(1, Pin.IN, Pin.PULL_UP)
trig = Pin(14, Pin.OUT)
echo = Pin(15, Pin.IN)

# Variable pour stocker la mesure précédente
derniere_dist = 0

# --- FONCTION CALLBACK MQTT ---
def reception_message(topic, msg):
    print("Message reçu sur {}: {}".format(topic, msg))
    if msg == b"ON":
        led.value(1)
        print("Système ACTIVÉ")
    elif msg == b"OFF":
        led.value(0)
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

print("Envoi des donnees si variation > 8cm...")

while True:
    try:
        client.check_msg()
        
        if led.value() == 1:
            actuelle_dist = get_distance()
            
            # Calcul de la différence absolue
            # On utilise la formule : $$\Delta d = |d_{actuelle} - d_{precedente}|$$
            difference = abs(actuelle_dist - derniere_dist)
            
            if actuelle_dist > 0 and difference > 8:
                valeur_bouton = button.value()
                message = "{} : Ecart de {}cm (Dist: {}cm)".format(NOM_SYSTEME, difference, actuelle_dist)
                
                client.publish("pico/distance", message)
                client.publish("pico/bouton", "APPUYE" if valeur_bouton == 0 else "RELACHE")
                
                print("Envoi MQTT :", message)
                
                # On met à jour la référence pour la prochaine comparaison
                derniere_dist = actuelle_dist
        
    except Exception as e:
        print("Erreur détectée, reconnexion...")
        try:
            client.connect()
            client.subscribe("pico/led")
        except:
            pass
            
    time.sleep(1)