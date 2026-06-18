import requests
from bs4 import BeautifulSoup
from google import genai
import random

# =========================================================
# EREN ŞAHİN - RESMİ GEMINI YAPAY ZEKA ANAHTARI
API_KEY = os.getenv("API_KEY")
# =========================================================

def siteyi_tar(url):
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ]
    headers = {"User-Agent": random.choice(user_agents)}
    try:
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url
            
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for element in soup(["script", "style", "noscript", "svg", "header", "footer"]):
            element.decompose()
            
        metin = soup.get_text(separator='\n', strip=True)
        return f"Site: {url}\nBaşlık: {soup.title.string if soup.title else 'Yok'}\nİçerik: {metin[:8000]}"
    except Exception as e:
        return f"HATA: Hedef sunucu bağlantı vermedi. Detay: {str(e)}"

def yapay_zekaya_raporlat(ham_veri):
    sistem_talimati = (
        "Sen kıdemli bir kurumsal dijital pazarlama ve SEO danışmanısın. "
        "Analiz ettiğin sitenin teknik, hız og içerik eksiklerini madde madde, profesyonel bir dille yaz."
    )
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model='gemini-1.5-flash-latest',
            contents=f"{sistem_talimati}\n\nVeriler:\n{ham_veri}"
        )
        return response.text
    except Exception as e:
        return f"Yapay Zeka Analiz Hatası: {str(e)}"

def unsplash_icin_kelime_bul(metin):
    sistem_talimati = (
        "Sen bir sinema yönetmeni ve sanat danışmanısın. Kullanıcının verdiği metni analiz et ve "
        "buna en uygun epik, sinematik, endüstriyel veya profesyonel konsepti belirle. Metin çok kısa "
        "olsa bile (örn: 'food standards') bunu görsele dönüştürülebilir derin bir aramaya çevir.\n\n"
        "ÇIKTI FORMATI KESİNLİKLE ŞU ŞEKİLDE OLMALIDIR:\n"
        "Konsept: [Metne uygun Türkçe havalı bir isim] | Search: [İngilizce 2-3 arama kelimesi]\n\n"
        "ÖNEMLİ KURALLAR:\n"
        "- ASLA markdown (```) işareti kullanma!\n"
        "- Sadece yukarıdaki formatta tek satır cevap ver.\n"
        "- Örnek Kısa Kelime (food standards): Konsept: Küresel Gıda Standartları | Search: food industry quality control\n"
    )
    
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model='gemini-1.5-flash-latest',
            contents=f"{sistem_talimati}\n\nKullanıcı Metni:\n{metin}"
        )
        temiz_sonuc = response.text.replace("`", "").replace("text", "").strip()
        return temiz_sonuc
    except Exception as e:
        print(f"GEMINI HATASI: {e}")
        m_low = metin.lower()
        if any(k in m_low for k in ["dağ", "yağmur", "yürüyüş"]): return "Konsept: Doğanın Kalbinde Zorlu Yolculuk | Search: dark moody mountain rain"
        elif any(k in m_low for k in ["tarım", "buğday", "çiftçi"]): return "Konsept: Sürdürülebilir Tarım | Search: golden wheat field"
        else:
            # Akıllı dinamik yedekleme
            kisa_metin = " ".join(metin.split()[:3])
            if not kisa_metin: kisa_metin = "cinematic nature"
            return f"Konsept: Otomatik Akıllı Sentez | Search: {kisa_metin}"