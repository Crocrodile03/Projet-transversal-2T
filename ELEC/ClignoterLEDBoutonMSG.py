from machine import Pin
import time

# Configuration de la LED sur GP0
led = Pin(0, Pin.OUT)

button = Pin(14, Pin.IN)

print("Programme prêt !")

while True:
    # Vérifie si le bouton est pressé (valeur == 1)
    if button.value() == 1:
        print("Bouton appuyé !")
        led.value(0) # Allume la LED quand on appuie
        time.sleep(0.2) # Petit délai pour éviter les rebonds
    else:
        led.value(1) # Éteint la LED sinon
    
