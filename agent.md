//öss  
//tcc  
//sadex  

# 📘 Nil Agent Chrome Eklentisi — Kapsamlı Teknik Dokümantasyon

---

## 🎯 AMAÇ  
- WhatsApp Web ve Instagram Web’de gelen mesajları otomatik olarak topla.  
- OpenAI tabanlı asistanlarla çok dilli yanıt üret.  
- Kullanıcının favorilerini ve geçmiş loglarını yönet.  
- Tüm verileri `chrome.storage.local`’da sakla.  
- Chrome MV3 sınırlamalarına uyumlu, ek bağımlılıksız, sürdürülebilir bir yapı sun.

---

## 🛠️ KULLANILAN TEKNOLOJİLER (DOSYA BAZINDA)

| Dosya             | Teknolojiler & Kütüphaneler                                                                 |
|-------------------|---------------------------------------------------------------------------------------------|
| `manifest.json`   | JSON, Chrome Extension MV3 API                                                              |
| `background.js`   | JavaScript (ES6+), Fetch API, Chrome Runtime Messaging, Promise, Async/Await                |
| `content.js`      | JavaScript (ES6+), DOM API, Window Scroll, Clipboard API, Document.execCommand, setTimeout  |
| `popup.html`      | HTML5, CSS3, Popup MV3, Semantic Elements                                                   |
| `popup.js`        | JavaScript (ES6+), Chrome Tabs & Runtime Messaging, Async/Await                             |
| `popup.css`       | CSS3, Responsive Tasarım                                                                    |
| `panel.html`      | HTML5, Semantic Bölümler                                                                     |
| `panel.js`        | JavaScript (ES6+), Chrome Runtime Messaging, Module Import/Export                           |
| `sidepanel.html`  | HTML5, CSS3 (inline stil), `<textarea>`, `<select>`, DOM API                                |
| `sidepanel.js`    | JavaScript (ES6+), Chrome Storage API, Chrome Runtime Messaging                             |
| `storage.js`      | JavaScript (ES6+), Chrome Storage API, Module Export/Import                                 |

---

## 🔍 DOSYA GÖREVLERİ & İŞ AKIŞI

### 1. `manifest.json`  
- Chrome MV3 manifest versiyonunu ayarla.  
- İzinleri (`permissions`, `host_permissions`) tanımla.  
- `background`, `content_scripts`, `action` yapılandırmasını yap.

### 2. `background.js`  
- `chrome.runtime.onMessage` ile `"AI_REPLY"` mesajlarını dinle.  
- OpenAI API’sine POST isteği yap, gelen cevabı al.  
- `sendResponse` ile çağıran script’e sonucu ilet.  
- `getKey()` fonksiyonu ile `chrome.storage.local`’den API key’i getir.

### 3. `content.js`  
- Aktif hostname’in WhatsApp veya Instagram olduğuna bak, değilsen çık.  
- Sayfayı en alta scroll et, `while` ile yukarı kaydırma döngüsü oluştur.  
- `document.execCommand("copy")` ile tüm body içeriğini kopyala.  
- `navigator.clipboard.readText()` ile metni al, `chrome.storage.local.set` ile `fullConversation` kaydet.  
- `chrome.runtime.onMessage` ile `OPEN_PANEL` ve `GET_CONVO` komutlarını dinle.  
- `injectPanel()` fonksiyonu ile `iframe` olarak `panel.html` ekle.

### 4. `popup.html`  
- Üç buton:  
  - `#go-chat`: Sohbeti topla.  
  - `#show-favorites`: Favorileri göster/gizle.  
  - `#open-panel`: Yan paneli aç.  
- Gizli `<section>` ile favori ve geçmiş pane’leri hazır tut.

### 5. `popup.js`  
- `go-chat` tıklayınca aktif tab’a `{ cmd: "GET_CONVO" }` mesajı gönder.  
- `open-panel` tıklayınca `{ cmd: "OPEN_PANEL" }` mesajını gönder.  
- `show-favorites` tıklayınca `storage.js`’den `getFavorites()`, sonuçları listele.

### 6. `popup.css`  
- Basit, mobil uyumlu stil.  
- Buton genişlik %100, margin/padding ile dokunmatik dostu.

### 7. `panel.html`  
- `<div id="conversation">`, `<div id="assistant">`, `<div id="warn">` alanları.  
- `<textarea id="response">` ile kullanıcı girdi,  
- `#send` ve `#review` butonları.

### 8. `panel.js`  
- Yüklenince `chrome.storage.local.get("fullConversation")`, `#conversation`’a yaz.  
- `send` tıklayınca `chrome.runtime.sendMessage({ type: "AI_REPLY", text })`, cevabı `#assistant`’a yaz ve `saveConversation()`.  
- `review` tıklayınca `addFavorite({...})` çağrısı ile favoriye ekle.

### 9. `sidepanel.html`  
- `<textarea id="conversation" readonly>`,  
- `<textarea id="user-input">`,  
- `<select id="lang-select">` çok dilli destek,  
- `<button id="send-btn">`,  
- `<div id="response">`.

### 10. `sidepanel.js`  
- `DOMContentLoaded` ile `fullConversation`’ı yükle.  
- `send-btn` tıklayınca `chrome.runtime.sendMessage({ type: "AI_REPLY", text, targetLang })`, sonucu göster.

### 11. `storage.js`  
- `saveConversation(text)`: `logs` dizisine `{ ts, text }` ekle.  
- `addFavorite(fav)`: `favorites` dizisine `fav` objesi ekle.  
- `getFavorites()`: `favorites` dizisini döndür.

---

## ✅ GELECEK GELİŞTİRMELER İÇİN TODO LİSTESİ

1. **API Key Güvenliği**  
   - Key’i `chrome.storage.local` yerine `chrome.identity` veya `sessionStorage`’a taşı.  
   - Base64 ya da OAuth tabanlı token yönetimine geç.

2. **Otomatik Dil Algılama**  
   - İlk mesajda `navigator.language` veya AI analiz ile hedef dili belirle.  
   - `lang-select` default’u kullanıcı diline göre ata.

3. **Sesli Mesaj Desteği (Whisper)**  
   - MediaRecorder ile ses kaydı al,  
   - Whisper API ile yazıya dönüştür,  
   - `fullConversation`’a ekle.

4. **Alternatif AI Cevap Yeniden Oluştur**  
   - Panel/sidepanel’e “Yeniden Oluştur” butonu ekle.  
   - Kullanıcının beğenmediği cevabı yeni prompt ile tekrar gönder.

5. **Görsel İçerik Kopyalama**  
   - `img` etiketlerini base64 string’e çevir,  
   - Metinle birlikte sakla ve göster.

6. **Log Görüntüleme Arayüzü**  
   - Popup veya panel içinde `logs` sekmesi oluştur,  
   - Zaman damgalarını formatlayarak listele.  
   - “Export” butonu ile JSON/TXT dışa aktar.

7. **A/B Test ve Model Seçimi**  
   - Kullanıcıya `gpt-3.5`, `gpt-4o`, özel modeller arasında geçiş imkânı ver.  
   - Yanıt performansını ölç, favorilere işaretle.

8. **Webhook & Entegrasyonlar**  
   - AI yanıtlarını Notion, Discord gibi dış servislere webhook ile gönder.  
   - Kullanıcı ayarlarında entegrasyon toggles ekle.

9. **Geliştirici Modu**  
   - Advanced ayarlar: max tokens, temperature, top_p gibi parametreler.  
   - Test sayfaları için mock API endpoint’leri tanımla.

10. **UI/UX İyileştirmeleri**  
   - Temalar (light/dark mode) ekle.  
   - Responsive iyileştirmeler, mobil görünüm testi.  
   - Erişilebilirlik (aria-label, keyboard navigation).

---

🔧 Bu kapsamlı dökümantasyon, Nil Agent’in mevcut iskeletini ve ileri seviye roadmap’ini detaylı şekilde ortaya koyar.  
