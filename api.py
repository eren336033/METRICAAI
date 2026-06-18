import os
from flask import Flask, request, jsonify
from flask_cors import CORS
# Kendi projendeki diğer importlar (scraper vs.) aşağıda aynen kalabilir
from scraper import analiz_et, prompt_uret

app = Flask(__name__)
CORS(app)  # Ön yüz ile arka yüzün haberleşebilmesi için şart

# =========================================================
# EREN ŞAHİN - ENTEGRE EDİLMİŞ MEDYA API KEYLERİ (GÜVENLİ KASA)
# =========================================================
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
# =========================================================

def prompt_ayikla(raw_prompt):
    try:
        # Senin mevcut prompt ayıklama mantığın buraya gelecek kanki
        pass
    except Exception as e:
        return str(e)

@app.route('/analiz', methods=['POST'])
def analiz_endpoint():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL gerekli"}), 400
    try:
        rapor = analiz_et(url)
        return jsonify({"rapor": rapor})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/prompt-uret', methods=['POST'])
def prompt_uret_endpoint():
    data = request.json
    metin = data.get('metin')
    try:
        prompt = prompt_uret(metin)
        return jsonify({"prompt": prompt})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Diğer görsel-ciz ve video-bul endpointlerin de varsa altına ekleyebilirsin.

if __name__ == '__main__':
    # Lokal testler için 5000 portu, yayında gunicorn bunu ezecek
    app.run(host='0.0.0.0', port=5000)