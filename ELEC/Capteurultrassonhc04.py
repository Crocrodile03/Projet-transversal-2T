import machine
import utime

# Configuration des broches
trig = machine.Pin(15, machine.Pin.OUT)
echo = machine.Pin(14, machine.Pin.IN)

def get_distance():
    # 1. On s'assure que le Trig est bas
    trig.low()
    utime.sleep_us(2)
    
    # 2. On envoie une impulsion de 10 microsecondes
    trig.high()
    utime.sleep_us(10)
    trig.low()
    
    # 3. On attend que l'Echo passe à l'état haut (début du signal)
    while echo.value() == 0:
        signaloff = utime.ticks_us()
        
    # 4. On attend que l'Echo repasse à l'état bas (fin du signal)
    while echo.value() == 1:
        signalon = utime.ticks_us()
    
    # 5. Calcul de la durée du trajet
    timepassed = signalon - signaloff
    
    # 6. Calcul de la distance (vitesse du son : 343 m/s ou 0.0343 cm/us)
    # On divise par 2 car le son fait l'aller-retour
    distance = (timepassed * 0.0343) / 2
    
    return distance

# Boucle principale
while True:
    dist = get_distance()
    print("Distance : {:.2f} cm".format(dist))
    utime.sleep(1)