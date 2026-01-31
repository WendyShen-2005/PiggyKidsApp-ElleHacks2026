import serial
import time
from testing import pig_speak  # This is your ElevenLabs function
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load secrets from .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["userLog"]
collection = db["userLog"]
# 2. Define the collection globally (outside the try block)
phrases_col = db["userLog"]

# Setup MongoDB
try:
    # Quick test to see if connection works
    client.admin.command('ping')
    print("✅ MongoDB Connected!")
except Exception as e:
    print(f"❌ MongoDB Connection Failed: {e}")

def get_all_phrases():
    try:
        # 1. Fetch ALL documents from the Phrases collection
        # find({}) with an empty bracket means "Select *"
        all_documents = phrases_col.find({})
        
        # 2. Extract just the "text" field from each document
        # We use a list comprehension to make a clean list of sentences
        phrase_list = [doc["text"] for doc in all_documents if "text" in doc]
        
        if phrase_list:
            # 3. Join them all together with a small pause (full stop)
            full_speech = " ".join(phrase_list)
            return full_speech
        else:
            return "Oink! You made no financial decisions recently."
            
    except Exception as e:
        print(f"❌ Error fetching all documents: {e}")
        return "Oink! I had a connection error while trying to read everything."

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
    print("❌ Connection Failed. Is the Arduino Serial Monitor closed? It must be!")
    exit()

# --- 3. THE LISTENING LOOP ---
while True:
    if arduino.in_waiting > 0:
        # Read what the Arduino sent
        data = arduino.readline().decode('utf-8').strip()
        
        if data == "TILT_DETECTED":
            print("🚨 Tilt detected! Reading all database records...")
            
            # Fetch the long combined string
            full_message = get_all_phrases()
            
            print(f"🤖 Full message: {full_message}")
            
            # Send the whole thing to ElevenLabs
            pig_speak(full_message)
            
            print("✅ Full reading complete.")