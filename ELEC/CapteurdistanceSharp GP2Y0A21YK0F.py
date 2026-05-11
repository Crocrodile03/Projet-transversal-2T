import machine
import time

# Initialize ADC on Pin 26
adc = machine.ADC(26)

def get_distance():
    # Read raw 16-bit value (0-65535)
    raw_value = adc.read_u16()
    
    # Convert to voltage (Pico uses 3.3V reference)
    voltage = raw_value * (3.3 / 65535)
    
    # Prevent division by zero if voltage is too low
    if voltage < 0.4:
        return "Out of range (Too far)"
    
    # Standard formula for GP2Y0A21: Distance(cm) = 27.86 / (voltage - 0.42)
    # Note: These sensors are non-linear, so results are approximate.
    distance_cm = 27.86 / (voltage - 0.1) 
    
    return round(distance_cm, 2)

print("Starting Distance Sensor...")

while True:
    dist = get_distance()
    if isinstance(dist, float):
        print(f"Distance: {dist} cm")
    else:
        print(dist)
    
    time.sleep(0.5)