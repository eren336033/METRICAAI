'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, BarChart3, Image as ImageIcon, ShieldCheck, DownloadCloud, Loader2, BrainCircuit, CheckCircle2, Film, PlayCircle, Fingerprint } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [aktifSekme, setAktifSekme] = useState<'analiz' | 'prompt' | 'gorsel' | 'video'>('analiz');
  
  const [url, setUrl] = useState("");
  const [analizSonucu, setAnalizSonucu] = useState("");
  const [durum, setDurum] = useState<'bekliyor' | 'yukleniyor' | 'tamamlandi'>('bekliyor');
  const [taramaAsamasi, setTaramaAsamasi] = useState(0);

  const [hamMetin, setHamMetin] = useState("");
  const [uretilenPrompt, setUretilenPrompt] = useState("");
  const [promptDurum, setPromptDurum] = useState<'bekliyor' | 'yukleniyor' | 'tamamlandi'>('bekliyor');

  const [manuelPrompt, setManuelPrompt] = useState("");
  const [uretilenGorsel, setUretilenGorsel] = useState("");
  const [gorselDurum, setGorselDurum] = useState<'bekliyor' | 'yukleniyor' | 'tamamlandi'>('bekliyor');

  const [uretilenVideo, setUretilenVideo] = useState("");
  const [videoDurum, setVideoDurum] = useState<'bekliyor' | 'yukleniyor' | 'tamamlandi'>('bekliyor');

  const asamalar = [
    "Güvenli Ağ Protokolü Başlatılıyor", 
    "Tarım Altyapı Verileri Çözümleniyor", 
    "Agrozan Derin Öğrenme Aktif", 
    "Sentez Raporu Oluşturuluyor"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (durum === 'yukleniyor') interval = setInterval(() => { setTaramaAsamasi((prev) => (prev < 3 ? prev + 1 : prev)); }, 2000);
    else setTaramaAsamasi(0);
    return () => clearInterval(interval);
  }, [durum]);

  // --- KLASİK MERKEZİ 3D ESNEME ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22 });
  const cardRotateX = useTransform(springY, [-500, 500], [4, -4]);
  const cardRotateY = useTransform(springX, [-500, 500], [-4, 4]);
  const spotlightX = useTransform(springX, [-500, 500], [-120, 120]);
  const spotlightY = useTransform(springY, [-500, 500], [-120, 120]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const analizBaslat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;
    setDurum('yukleniyor'); setAnalizSonucu("");
    try {
      const res = await fetch('http://localhost:5000/analiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url }) });
      const data = await res.json();
      setAnalizSonucu(data.rapor); setDurum('tamamlandi');
    } catch (error) { setAnalizSonucu("Hata: Sunucu bağlantısı sağlanamadı."); setDurum('tamamlandi'); }
  };

  const promptUret = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hamMetin) return;
    setPromptDurum('yukleniyor');
    try {
      const res = await fetch('http://localhost:5000/prompt-uret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ metin: hamMetin }) });
      const data = await res.json();
      setUretilenPrompt(data.prompt); setPromptDurum('tamamlandi');
    } catch (error) { setPromptDurum('bekliyor'); }
  };

  const gorselCiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manuelPrompt) return;
    setGorselDurum('yukleniyor');
    try {
      const res = await fetch('http://localhost:5000/gorsel-ciz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: manuelPrompt }) });
      const data = await res.json();
      setUretilenGorsel(data.gorsel_url); setGorselDurum('tamamlandi');
    } catch (error) { setGorselDurum('bekliyor'); }
  };

  const videoCek = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manuelPrompt) return;
    setVideoDurum('yukleniyor');
    try {
      const res = await fetch('http://localhost:5000/video-bul', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: manuelPrompt }) });
      const data = await res.json();
      setUretilenVideo(data.video_url); setVideoDurum('tamamlandi');
    } catch (error) { setVideoDurum('bekliyor'); }
  };

  const promptuGorseleAktar = () => { setManuelPrompt(uretilenPrompt); setAktifSekme('gorsel'); };
  const promptuVideoyaAktar = () => { setManuelPrompt(uretilenPrompt); setAktifSekme('video'); };

  const dosyaIndir = async (dosyaUrl: string, uzanti: 'jpg' | 'mp4') => {
    if (!dosyaUrl) return;
    try {
      const response = await fetch(dosyaUrl);
      const blob = await response.blob();
      const objUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a'); 
      link.href = objUrl; link.download = `Agrozan_Medya_${Date.now()}.${uzanti}`; 
      document.body.appendChild(link); link.click(); window.URL.revokeObjectURL(objUrl); document.body.removeChild(link);
    } catch (err) { window.open(dosyaUrl, '_blank'); }
  };

  return (
    <main className="min-h-screen w-full bg-[#080705] text-[#D4D4D8] font-sans overflow-hidden relative selection:bg-amber-600/30">
      
      {/* KLASİK DİNAMİK ARKA PLAN */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#151310_1px,transparent_1px),linear-gradient(to_bottom,#151310_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_30%,transparent_100%)] opacity-70 pointer-events-none" />
      <motion.div style={{ x: spotlightX, y: spotlightY }} className="absolute top-[15%] left-[25%] w-[800px] h-[800px] bg-gradient-to-br from-amber-500/[0.05] to-transparent rounded-full blur-[220px] pointer-events-none mix-blend-screen" />

      {/* KLASİK ORTALANMIŞ ÜST MENÜ */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 flex justify-between items-center px-8 py-4 rounded-2xl bg-[#0d0a08]/80 backdrop-blur-2xl border border-amber-900/30 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]">
        
        {/* LOGO */}
        <div className="flex items-center gap-3.5 cursor-pointer">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1c140c] to-black border border-amber-800/40 shadow-inner">
            <img src="/logo.png" alt="Agrozan Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white mb-0.5">AGROZAN<span className="text-amber-500 font-light">.AI</span></span>
            <span className="text-[9px] text-amber-600/70 font-semibold uppercase tracking-[0.3em]">Medya Stüdyosu</span>
          </div>
        </div>

        {/* SEKMELER */}
        <div className="hidden md:flex bg-black/60 p-1.5 rounded-xl border border-amber-900/20 backdrop-blur-md">
          <button onClick={() => setAktifSekme('analiz')} className={`px-5 py-2.5 rounded-lg font-medium text-xs uppercase tracking-widest transition-all duration-300 ${aktifSekme === 'analiz' ? 'bg-zinc-900 text-white shadow-md border border-amber-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}>Denetim</button>
          <button onClick={() => setAktifSekme('prompt')} className={`px-5 py-2.5 rounded-lg font-medium text-xs uppercase tracking-widest transition-all duration-300 ${aktifSekme === 'prompt' ? 'bg-zinc-900 text-white shadow-md border border-amber-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}>Sentez</button>
          <button onClick={() => setAktifSekme('gorsel')} className={`px-5 py-2.5 rounded-lg font-medium text-xs uppercase tracking-widest transition-all duration-300 ${aktifSekme === 'gorsel' ? 'bg-zinc-900 text-white shadow-md border border-amber-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}>Fotoğraf</button>
          <button onClick={() => setAktifSekme('video')} className={`px-5 py-2.5 rounded-lg font-medium text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${aktifSekme === 'video' ? 'bg-amber-500/15 text-amber-400 shadow-md border border-amber-500/30' : 'text-zinc-500 hover:text-amber-500/60'}`}><Film className="w-3.5 h-3.5"/> Prodüksiyon</button>
        </div>

        {/* KULLANICI */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-amber-500 font-bold tracking-[0.2em] uppercase flex items-center justify-end gap-1"><Fingerprint className="w-3 h-3"/> Yönetici</p>
            <p className="text-xs text-zinc-300 font-medium">Eren Şahin</p>
          </div>
        </div>
      </div>

      {/* KLASİK MERKEZİ KUTU (HER ŞEY EKRANIN TAM ORTASINDA) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-6 perspective-[2500px]">
        <motion.div style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: "preserve-3d" }} className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            
            {/* === 1. SEKME: ANALİZ === */}
            {aktifSekme === 'analiz' && (
              <motion.div key="analiz" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
                {durum === 'bekliyor' && (
                  <div className="bg-[#0b0806]/90 backdrop-blur-3xl border border-amber-900/20 p-14 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="mb-12 text-center">
                      <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Ağ <span className="text-amber-500 font-light">Denetimi</span></h1>
                      <p className="text-zinc-500 text-sm tracking-wide max-w-md mx-auto">Hedef platformun altyapısını Agrozan standartlarında analiz edin.</p>
                    </div>
                    <form onSubmit={analizBaslat}>
                      <div className="flex items-center bg-black/50 border border-amber-900/30 rounded-xl p-1.5 focus-within:border-amber-500/50 transition-all shadow-inner">
                        <Search className="text-amber-600/50 w-5 h-5 ml-4" />
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Denetlenecek URL (örn: agrozan.com)" className="w-full bg-transparent px-5 py-4 text-base text-zinc-200 focus:outline-none placeholder-zinc-700" required />
                        <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-black px-8 py-3.5 rounded-lg font-bold transition-all flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Başlat</button>
                      </div>
                    </form>
                  </div>
                )}
                
                {durum === 'yukleniyor' && (
                  <div className="flex flex-col items-center justify-center bg-[#0b0806]/90 backdrop-blur-3xl border border-amber-900/20 p-24 rounded-3xl text-center shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-8" />
                    <h2 className="text-lg font-medium text-white mb-2 tracking-widest uppercase">Sistem Devrede</h2>
                    <p className="text-amber-600/70 font-mono text-xs uppercase tracking-[0.2em]">{asamalar[taramaAsamasi]}</p>
                  </div>
                )}

                {durum === 'tamamlandi' && (
                  <div className="bg-[#0b0806]/95 backdrop-blur-3xl border border-amber-900/30 p-12 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
                    <button onClick={() => {setDurum('bekliyor'); setUrl("");}} className="mb-10 text-[10px] font-bold tracking-[0.2em] text-zinc-500 hover:text-white uppercase flex items-center gap-2 transition-colors">&larr; YENİDEN BAŞLAT</button>
                    <div className="border-b border-zinc-800/80 pb-6 mb-8 flex justify-between items-center">
                      <div><h2 className="text-2xl font-semibold text-white tracking-tight">Rapor Sonucu</h2><p className="text-amber-500/70 text-xs font-mono mt-1">{url}</p></div>
                      <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5"/> DOĞRULANDI</div>
                    </div>
                    <div className="text-zinc-300 text-sm leading-loose prose prose-invert max-w-none prose-h2:text-amber-500 prose-strong:text-white"><ReactMarkdown>{analizSonucu}</ReactMarkdown></div>
                  </div>
                )}
              </motion.div>
            )}

            {/* === 2. SEKME: SENTEZ === */}
            {aktifSekme === 'prompt' && (
              <motion.div key="prompt" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
                <div className="bg-[#0b0806]/90 backdrop-blur-3xl border border-amber-900/20 p-14 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="mb-12 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Vizyon <span className="text-amber-500 font-light">Sentezi</span></h2>
                    <p className="text-zinc-500 text-sm tracking-wide max-w-md mx-auto">Kelimeleri sinematik görsel ve video kodlarına dönüştürün.</p>
                  </div>
                  <form onSubmit={promptUret}>
                    <textarea value={hamMetin} onChange={(e) => setHamMetin(e.target.value)} placeholder="Agrozan vizyonunu buraya girin... (örn: buğday hasadı, gıda güvenliği)" className="w-full h-40 bg-black/50 border border-amber-900/30 rounded-xl p-6 text-base text-zinc-200 focus:outline-none focus:border-amber-500/50 resize-none mb-8 transition-all placeholder-zinc-700" required />
                    <button type="submit" disabled={promptDurum === 'yukleniyor'} className="w-full bg-amber-600 hover:bg-amber-500 text-black px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                      {promptDurum === 'yukleniyor' ? <><Loader2 className="w-4 h-4 animate-spin" /> İŞLENİYOR</> : <><BrainCircuit className="w-4 h-4" /> KOD SENTEZİNİ BAŞLAT</>}
                    </button>
                  </form>

                  {promptDurum === 'tamamlandi' && uretilenPrompt && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-black/40 border border-amber-900/30 p-8 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.2em] mb-4">Üretilen Kavramsal Kod</p>
                      <textarea readOnly value={uretilenPrompt} className="w-full h-16 bg-transparent text-white text-lg font-medium focus:outline-none resize-none mb-6"/>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={promptuGorseleAktar} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/50 px-6 py-3.5 rounded-lg font-semibold text-xs tracking-widest transition-all flex items-center justify-center gap-2"><ImageIcon className="w-4 h-4"/> Fotoğrafa Aktar</button>
                        <button onClick={promptuVideoyaAktar} className="flex-1 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-600/30 px-6 py-3.5 rounded-lg font-semibold text-xs tracking-widest transition-all flex items-center justify-center gap-2"><Film className="w-4 h-4"/> Prodüksiyona Aktar</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* === 3. SEKME: FOTOĞRAF === */}
            {aktifSekme === 'gorsel' && (
              <motion.div key="gorsel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
                <div className="bg-[#0b0806]/90 backdrop-blur-3xl border border-amber-900/20 p-14 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="mb-12 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Fotoğraf <span className="text-amber-500 font-light">Stüdyosu</span></h2>
                  </div>
                  <form onSubmit={gorselCiz} className="mb-10">
                    <div className="flex items-center bg-black/50 border border-amber-900/30 rounded-xl p-1.5 focus-within:border-amber-500/50 transition-all">
                      <input type="text" value={manuelPrompt} onChange={(e) => setManuelPrompt(e.target.value)} placeholder="Sentezlenen kodu girin..." className="w-full bg-transparent px-5 py-4 text-base text-zinc-200 focus:outline-none font-mono" required />
                      <button type="submit" disabled={gorselDurum === 'yukleniyor'} className="bg-zinc-200 hover:bg-white text-black px-8 py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50">
                        {gorselDurum === 'yukleniyor' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ImageIcon className="w-4 h-4" /> ÇEKİMİ YAP</>}
                      </button>
                    </div>
                  </form>
                  {gorselDurum === 'tamamlandi' && uretilenGorsel && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden border border-amber-900/30 group/image">
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-700 flex items-center gap-2 z-10"><ShieldCheck className="w-3.5 h-3.5 text-amber-500"/> HD LİSANS</div>
                      <img src={uretilenGorsel} alt="Gerçek Çekim" className="w-full object-cover transition-transform duration-1000 group-hover/image:scale-[1.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-center p-8 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500">
                        <button onClick={() => dosyaIndir(uretilenGorsel, 'jpg')} className="bg-amber-600 text-black px-8 py-4 rounded-xl font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl"><DownloadCloud className="w-4 h-4"/> BİLGİSAYARA KAYDET</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* === 4. SEKME: VİDEO === */}
            {aktifSekme === 'video' && (
              <motion.div key="video" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
                <div className="bg-[#0b0806]/90 backdrop-blur-3xl border border-amber-900/30 p-14 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="mb-12 text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Sinematik <span className="text-amber-500">Prodüksiyon</span></h2>
                  </div>
                  <form onSubmit={videoCek} className="mb-10">
                    <div className="flex items-center bg-black/50 border border-amber-900/40 rounded-xl p-1.5 focus-within:border-amber-500/60 transition-all shadow-inner">
                      <input type="text" value={manuelPrompt} onChange={(e) => setManuelPrompt(e.target.value)} placeholder="Video konsept kodunu yapıştırın..." className="w-full bg-transparent px-5 py-4 text-base text-amber-100 focus:outline-none font-mono" required />
                      <button type="submit" disabled={videoDurum === 'yukleniyor'} className="bg-amber-600 hover:bg-amber-500 text-black px-8 py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50">
                        {videoDurum === 'yukleniyor' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlayCircle className="w-4 h-4" /> REJİYİ BAŞLAT</>}
                      </button>
                    </div>
                  </form>

                  {videoDurum === 'tamamlandi' && uretilenVideo && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden border border-amber-900/40 group/video shadow-[0_0_50px_rgba(245,158,11,0.05)]">
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded border border-amber-500/30 flex items-center gap-2 z-10"><Film className="w-3.5 h-3.5"/> 4K ÇEKİM</div>
                      
                      <video src={uretilenVideo} autoPlay loop muted playsInline className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover/video:scale-[1.03]" />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-center p-8 opacity-0 group-hover/video:opacity-100 transition-opacity duration-500">
                        <button onClick={() => dosyaIndir(uretilenVideo, 'mp4')} className="bg-amber-600 text-black px-8 py-4 rounded-xl font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]"><DownloadCloud className="w-4 h-4"/> VİDEOYU İNDİR (.MP4)</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}