import os
import time
import random
import string
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
signal_store = {}
ROOM_TTL = 600

def gen_room():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))

def sweep():
    now = time.time()
    for key in list(signal_store.keys()):
        if now - signal_store[key]['ts'] > ROOM_TTL:
            del signal_store[key]

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mobile')
def mobile():
    return render_template('mobile.html')

@app.route('/desktop')
def desktop():
    return render_template('desktop.html', room=gen_room())

@app.route('/desktop/clean/<room>')
def desktop_clean(room):
    return render_template('desktop_clean.html', room=room)

@app.route('/api/signal/<room>/<role>', methods=['POST'])
def post_signal(room, role):
    sweep()
    signal_store[f'{room}:{role}'] = {'data': request.get_json(), 'ts': time.time()}
    return jsonify({'ok': True})

@app.route('/api/signal/<room>/<role>', methods=['GET'])
def get_signal(room, role):
    entry = signal_store.get(f'{room}:{role}')
    return jsonify(entry['data'] if entry else {})

@app.route('/api/signal/<room>/clear', methods=['POST'])
def clear_signal(room):
    signal_store.pop(f'{room}:mobile_answer', None)
    return jsonify({'ok': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))