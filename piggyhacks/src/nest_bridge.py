import serial
import time
from testing import pig_speak  # This is your ElevenLabs function

# --- 1. SET YOUR PORT ---
# Look in Arduino IDE -> Tools -> Port. 
# Windows: 'COM3' | Mac: '/dev/cu.usbmodem...'
ARDUINO_PORT = 'COM7' 

# --- 2. START THE CONNECTION ---
try:
    arduino = serial.Serial(ARDUINO_PORT, 9600, timeout=1)
    time.sleep(2) # Let the Arduino reset
    print("✅ System Online. Move the pig to hear the Google Nest speak!")
except:
    print("❌ Connectiovenvn Failed. Is the Arduino Serial Monitor closed? It must be!")
    exit()

# --- 3. THE LISTENING LOOP ---
while True:
    if arduino.in_waiting > 0:
        # Read what the Arduino sent
        data = arduino.readline().decode('utf-8').strip()
        
        if data == "TILT_DETECTED":
            print("🚨 Tilt detected! Sending audio to Google Nest...")
            
            # Change this text to whatever you want the pig to say!
            pig_speak("Oink! You moved me! Your current balance is 50 dollars.")
            
            print("✅ Audio complete. Waiting for next move...")