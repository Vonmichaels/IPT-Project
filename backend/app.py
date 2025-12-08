from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)  

messages = [{"role": "assistant", "content": "I'm Haven, designed specifically to be your space for personal growth and self-care. I'm here to help with things like managing stress, building better habits, or finding mindful moments. What’s on your mind in that area?"}]

@app.route("/chat", methods=["POST"])
def chat():
    global messages
    data = request.json
    user_input = data.get("message")

    if not user_input: return jsonify({"error": "No message provided"}), 400

    messages.append({"role": "user", "content": user_input})

    response = ollama.chat(model="backend", messages=messages)
    assistant_response = response["message"]["content"]

    messages.append({"role": "assistant", "content": assistant_response})

    return jsonify({"response": assistant_response})

if __name__ == "__main__":
    app.run(debug=True)


