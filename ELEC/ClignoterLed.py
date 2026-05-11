from machine import Pin
import time

# Utilise "LED" pour la LED intégrée ou 0 pour le GPIO 0
led = Pin(0, Pin.OUT) 

while True:
    led.toggle()    # Alterne l'état (allumé/éteint)
    time.sleep(0.5) # Attend 500ms