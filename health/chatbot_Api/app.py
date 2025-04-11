from flask import Flask, request, jsonify, send_from_directory
import requests
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import logging
import json
import os

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS for specific origins
CORS(app, resources={
    r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}
}, supports_credentials=True)

api_key = os.getenv("HUGGING_FACE_API")

# Hugging Face API setup
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
HUGGINGFACE_API_KEY = os.environ.get("HUGGINGFACE_API_KEY", api_key)
HEADERS = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
}

PROMPT_TEMPLATE = """
You are a medical assistant. Analyze the user's symptoms and provide:
1. Possible causes
2. Recommended actions
3. When to see a doctor
Keep the response concise and professional.

User: {input}
Assistant:"""

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    })

# Endpoint for symptom prediction
@app.route("/ask", methods=["POST"])
def ask():
    try:
        user_input = request.json.get("message", "").strip().lower()

        # Basic intent detection to handle greetings or small talk
        casual_phrases = ["hi", "hello", "hey", "thank you", "thanks", "good morning", "good evening", "bye"]
        if any(phrase in user_input for phrase in casual_phrases):
            casual_responses = {
                "hi": "Hello! How can I assist you with your health today?",
                "hello": "Hi there! Feel free to describe any symptoms you're experiencing.",
                "hey": "Hey! I'm here to help with health-related concerns.",
                "thank you": "You're welcome! Let me know if you have any other questions.",
                "thanks": "Happy to help!",
                "good morning": "Good morning! Hope you're feeling well. Do you have any symptoms to discuss?",
                "good evening": "Good evening! Let me know how I can assist you.",
                "good night": "Good night! Sleep well. Let me know if you have any problem before you sleep.",
                "bye": "Take care! I'm here whenever you need health advice."
            }
            for key in casual_responses:
                if key in user_input:
                    return jsonify({"reply": casual_responses[key]})

        # Proceed with medical analysis
        prompt = PROMPT_TEMPLATE.format(input=user_input)

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 200,
                "temperature": 0.7
            }
        }

        response = requests.post(HUGGINGFACE_API_URL, headers=HEADERS, json=payload)
        if response.status_code == 200:
            output = response.json()[0]["generated_text"]
            reply = output.split("Assistant:")[-1].strip()
        else:
            reply = "Sorry, I couldn't process your request right now."

        return jsonify({"reply": reply})
    except Exception as e:
        logger.error(f"Error in /ask endpoint: {str(e)}")
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


# Endpoint for health tracking data
@app.route("/api/health/tracking", methods=["GET"])
def get_health_tracking():
    today = datetime.today()
    data = []
    for i in range(7):
        day = (today - timedelta(days=i)).strftime('%Y-%m-%d')
        data.append({
            "date": day,
            "steps": random.randint(5000, 11000),
            "heart_rate": random.randint(65, 80),
            "sleep_hours": round(random.uniform(5.5, 8.5), 1),
            "calories": random.randint(1800, 2600),
            "blood_pressure": f"{random.randint(110, 130)}/{random.randint(70, 85)}",
            "weight": round(random.uniform(60, 80), 1),
            "mood": random.choice(["Good", "Fair", "Excellent", "Poor"])
        })
    return jsonify(list(reversed(data)))

if __name__ == "__main__":
    try:
        port = int(os.environ.get("PORT", 5000))
        logger.info(f"Starting Flask server on port {port}")
        logger.info(f"CORS enabled for origins: http://localhost:5173, http://127.0.0.1:5173")
        app.run(host="0.0.0.0", port=port, debug=True)
    except Exception as e:
        logger.error(f"Failed to start Flask server: {str(e)}")
        raise
