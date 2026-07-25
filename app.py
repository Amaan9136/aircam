import socket
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
signal_store = {}

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

@app.route('/')
def index():
    return render_template('index.html', local_ip=get_local_ip())

@app.route('/mobile')
def mobile():
    return render_template('mobile.html', local_ip=get_local_ip())

@app.route('/desktop')
def desktop():
    return render_template('desktop.html', local_ip=get_local_ip())

@app.route('/api/signal/<role>', methods=['POST'])
def post_signal(role):
    signal_store[role] = request.get_json()
    return jsonify({'ok': True})

@app.route('/api/signal/<role>', methods=['GET'])
def get_signal(role):
    return jsonify(signal_store.get(role) or {})

@app.route('/api/signal/clear', methods=['POST'])
def clear_signal():
    signal_store.clear()
    return jsonify({'ok': True})

if __name__ == '__main__':
    ip = get_local_ip()
    print(f'AirCam running. Mobile: http://{ip}:5000/mobile  Desktop: http://{ip}:5000/desktop')
    app.run(host='0.0.0.0', port=5000, debug=True)
