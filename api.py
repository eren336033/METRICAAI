from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random
import scraper

app = Flask(__name__)
CORS(app)

# =========================================================
# EREN ŞAHİN - ENTEGRE EDİLMİŞ MEDYA API KEYLERİ
UNSPLASH_ACCESS_KEY = "Zbtix8L6qE5K46cuuoMnmZzw8Gk-CX9W3G-xYj1EtQQ"
PEXELS_API_KEY = "NhwvaiZCggOptjF2KKXv9ynt4lCcLnhQrm869iooVTzwwLHTbp8Ra31r"
# =========================================================

def prompt_ayikla(raw_prompt):
    try:
        if "|" in raw_prompt:
            parts = raw_prompt.split("|")
            search_part = parts[-1].strip()
            if ":" in search_part:
                return search_part.split(":")[-1].strip()
            return search_part
        else:
            return raw_prompt.strip()
    except:
        return "cinematic nature"

@app.route('/analiz', methods=['POST'])
def analiz_et():
    try:
        data = request.json
        url = data.get('url')
        if not url: return jsonify({"rapor": "Lütfen bir URL girin."})
        ham_sonuc = scraper.siteyi_tar(url)
        final_rapor = scraper.yapay_zekaya_raporlat(ham_sonuc)
        return jsonify({"rapor": final_rapor})
    except Exception as e:
        return jsonify({"rapor": f"Analiz hatası: {str(e)}"})

@app.route('/prompt-uret', methods=['POST'])
def prompt_uret():
    try:
        data = request.json
        metin = data.get('metin', '')
        sonuc = scraper.unsplash_icin_kelime_bul(metin)
        return jsonify({"prompt": sonuc})
    except Exception as e:
        return jsonify({"prompt": "Konsept: Epik Doğa | Search: epic nature landscape"})

@app.route('/gorsel-ciz', methods=['POST'])
def gorsel_ciz():
    try:
        data = request.json
        raw_prompt = data.get('prompt', '')
        arama_kelimesi = prompt_ayikla(raw_prompt)
        
        url = f"[https://api.unsplash.com/search/photos?query=](https://api.unsplash.com/search/photos?query=){arama_kelimesi}&per_page=20&orientation=landscape&order_by=relevant&client_id={UNSPLASH_ACCESS_KEY}"
        res = requests.get(url)
        
        if res.status_code == 200:
            results = res.json().get('results', [])
            if results:
                secilen = random.choice(results[:8])
                return jsonify({"gorsel_url": secilen['urls']['raw'] + "&w=1920&q=80&fit=crop"})
        return jsonify({"gorsel_url": "[https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80&fit=crop](https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80&fit=crop)"})
    except Exception as e:
        return jsonify({"gorsel_url": "[https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80&fit=crop](https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80&fit=crop)"})

@app.route('/video-bul', methods=['POST'])
def video_bul():
    try:
        data = request.json
        raw_prompt = data.get('prompt', '')
        arama_kelimesi = prompt_ayikla(raw_prompt)

        headers = {"Authorization": PEXELS_API_KEY}
        url = f"[https://api.pexels.com/videos/search?query=](https://api.pexels.com/videos/search?query=){arama_kelimesi}&per_page=15&orientation=landscape"
        res = requests.get(url, headers=headers)
        
        if res.status_code == 200:
            video_data = res.json().get('videos', [])
            if video_data:
                secilen_video = random.choice(video_data[:6])
                mp4_link = ""
                for file in secilen_video.get('video_files', []):
                    if file['quality'] == 'hd' and file['file_type'] == 'video/mp4':
                        mp4_link = file['link']
                        break
                if not mp4_link and len(secilen_video.get('video_files', [])) > 0:
                    mp4_link = secilen_video['video_files'][0]['link']
                if mp4_link: return jsonify({"video_url": mp4_link})
                    
        return jsonify({"video_url": "[https://player.vimeo.com/external/403316685.hd.mp4?s=d00e16428e37bfdb3c9482f3efbc5df38902df35&profile_id=175](https://player.vimeo.com/external/403316685.hd.mp4?s=d00e16428e37bfdb3c9482f3efbc5df38902df35&profile_id=175)"})
    except Exception as e:
        return jsonify({"video_url": "[https://player.vimeo.com/external/403316685.hd.mp4?s=d00e16428e37bfdb3c9482f3efbc5df38902df35&profile_id=175](https://player.vimeo.com/external/403316685.hd.mp4?s=d00e16428e37bfdb3c9482f3efbc5df38902df35&profile_id=175)"})

if __name__ == '__main__':
    app.run(port=5000)