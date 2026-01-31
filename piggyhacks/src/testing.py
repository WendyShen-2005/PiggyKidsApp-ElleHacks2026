import os
import requests
from playsound import playsound # or use 'pygame' if playsound gives you trouble
from dotenv import load_dotenv

load_dotenv() # This looks for the .env file
ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

VOICE_ID = "jBpfuIE2acCO8z3wKNLl" # Example: Bella (or use your custom pig voice ID)

def pig_speak(text):
    print(f"🎙️ ElevenLabs is generating: '{text}'")
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": ELEVEN_LABS_API_KEY 
}
    
    data = {
    "text": text,
    "model_id": "eleven_flash_v2_5", # Updated for Free Tier 2026
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.5
    }
}

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        # Save the audio file temporarily
        with open("output.mp3", "wb") as f:
            f.write(response.content)
        
        print("🔊 Playing audio to Google Nest...")
        playsound("output.mp3")
        os.remove("output.mp3") # Clean up
    else:
        print(f"❌ ElevenLabs Error: {response.text}")