import serial
import time
from testing import pig_speak  # This is your ElevenLabs function
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import google.generativeai as genai

# Setup Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

# Load secrets from .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["userLog"]
collection = db["FinaluserLog"]
# 2. Define the collection globally (outside the try block)
phrases_col = db["FinaluserLog"]
current_balance = 50.0  # Example balance

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

def get_child_friendly_message(raw_logs, current_balance):
    # Systems Logic: Calculate interest (e.g., 1% daily for the demo)
    interest_rate = 0.05  # 5% daily interest for demonstration
    daily_interest = current_balance * interest_rate
    
    # The Prompt: This is where you tell Gemini how to behave
    prompt = f"""
    You are a friendly, magical piggy bank. 
    At the start, tell the child: The piggy bank has a balance of ${current_balance:.2f}
    Then tell them the following:
    '{raw_logs}'

    Make sure to highlight the importance of saving money and sound disapointed if they spend more than 50% of their balance.

    At the end, tell them in French: 'You will earn 
    ${daily_interest:.2f} in interest today due to your savings and spendings today!'
    Keep it short and use oinks!
    Make it all under 4 sentences total.
    """
    
    response = model.generate_content(prompt)
    return response.text


# --- 1. SET YOUR PORT ---
# Look in Arduino IDE -> Tools -> Port. 
# Windows: 'COM3' | Mac: '/dev/cu.usbmodem...'
ARDUINO_PORT = 'COM3' 

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
        data = arduino.readline().decode("utf-8", errors="ignore").strip()

        if data == "TILT_DETECTED":

            raw_text = get_all_phrases()
            balance = 50.0

            final_script = get_child_friendly_message(raw_text, balance)

            print(f"✨ Gemini transformed: {final_script}")

            # 🔥 STORE FRENCH RESPONSE INTO MONGO
            document = {
                "lang": "fr",
                "event": "daily_summary",
                "text": final_script,
                "current_balance": balance,
            }

            collection.insert_one(document)
            print("💾 French response saved to MongoDB.")

            # Speak it
            pig_speak(final_script)