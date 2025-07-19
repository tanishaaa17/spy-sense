# SpySense Ethical Keylogger

SpySense is an educational, ethical keylogger and process detection dashboard. It demonstrates how keylogging and process monitoring work, and provides a professional dashboard for visualizing logs and detecting suspicious processes. **This project is for ethical, educational, and research purposes only.**

---

## Features
- **Keylogging:** Logs all keypresses with timestamps to a log file.
- **Process Detection:** Scans running processes for suspicious activity (e.g., keyloggers) using `psutil`.
- **Dashboard UI:** React-based dashboard to view logs and detection results in real time.
- **CORS-enabled API:** Securely connects frontend and backend.

---

## Project Structure
```
ethical-hacking/
├── backend/
│   ├── app.py           # Flask backend
│   ├── detector.py      # Process detection logic
│   ├── keylogger.py     # Keylogger logic
│   ├── logs.txt         # Log file
│   └── requirements.txt # Backend dependencies
└── frontend/
    ├── src/
    │   ├── Dashboard.js # Dashboard page
    │   ├── Dashboard.css# Dashboard styles
    │   └── App.js       # Main React app
    └── ...              # React app files
```

---

## How to Run

### 1. Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
- Runs on [http://localhost:5000](http://localhost:5000)

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```
- Runs on [http://localhost:3000](http://localhost:3000)

---

## Dashboard UI

### Log Output Card
![Log Output Screenshot](screenshots/log-output.png)

### Detection Results Card
![Detection Results Screenshot](screenshots/detection-results.png)

---

## Disclaimer
This project is for **educational and ethical research purposes only**. Do not use it for malicious activity. Always have permission before running keyloggers or process monitors on any system. 