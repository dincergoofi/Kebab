# Real Kebab Istanbul Launch Checklist

Bu dosya, demo durumundan gercek yayina gecmek icin gerekenleri tek yerde toplar.

## 1. Isletmeden gerekli bilgiler

### Restoran profili

- Resmi isletme adi
- Kisa marka slogani:
  - `es`
  - `tr`
  - `en`
- Adres
- Telefon siparis hatti
- WhatsApp numarasi
- Google yorum linki
- Google Place ID
- Google Maps linki
- Calisma saatleri
- Ozel link:
  - ornek: `realistanbul.es/menu`

### QR / masa yapisi

- Kullanilacak masa kodlari:
  - `masa-1`
  - `masa-2`
  - `masa-3`
  - ...
- Her masa icin gorunecek etiket:
  - `Masa 1`
  - `Terraza 2`
  - `Salon 4`

## 2. Menu verisi

Her urun icin su alanlari doldurmamiz gerekiyor:

- kategori
- urun anahtari / slug
- ad:
  - `es`
  - `tr`
  - `en`
- aciklama:
  - `es`
  - `tr`
  - `en`
- net fiyat (`EUR`)
- icerik listesi
- alerjenler
- kalori
- aci seviyesi (`0-3`)
- stok durumu
- one cikan urun mu
- chef choice / badge var mi
- sira bilgisi

Hazir tablo icin:

- [menu-import-template.csv](C:/Users/hp/Downloads/RealKebabİstanbul/docs/menu-import-template.csv)

## 3. Gorseller

Oncelik verilecek urun gorselleri:

1. `kebab rollo`
2. `kebab pan`
3. `lahmacun`
4. `iskender`
5. `baklava`
6. `refrescos`
7. `agua`
8. `efes`

Her gorsel icin ideal format:

- en az `1400px` genislik
- dikey urun karti icin temiz crop
- koyu arka plan veya kolay kesilebilir arka plan
- ayni isik dili

Teslim yollarindan biri yeterli:

- Google Drive klasoru
- WeTransfer
- tek tek dosya

## 4. Supabase

Mevcut projede su taraf zaten var:

- migration yapisi
- feedback RPC
- game score RPC
- leaderboard
- restaurant / categories / products okuma katmani

Eksik olan gercek kurulum icin gerekenler:

- Supabase proje URL
- Supabase anon key
- migration calistirma yetkisi
- gercek veri importu

Bu proje icin gerekli dosyalar:

- [.env.example](C:/Users/hp/Downloads/RealKebabİstanbul/.env.example)
- [202604130001_initial_schema.sql](C:/Users/hp/Downloads/RealKebabİstanbul/supabase/migrations/202604130001_initial_schema.sql)
- [202605020002_restaurant_profile_columns.sql](C:/Users/hp/Downloads/RealKebabİstanbul/supabase/migrations/202605020002_restaurant_profile_columns.sql)

## 5. Admin panel icin gerekli scope

Ilk surum admin paneli su islemleri yapmali:

- fiyat guncelle
- urun gizle / goster
- stokta yok isaretle
- one cikan urun sec

Bunun icin gerekenler:

- Supabase Auth admin kullanicisi
- admin route
- basit CRUD ekranlari

## 6. Mobil QA

Kontrol edilecek cihazlar:

- iPhone Safari
- Android Chrome
- Instagram in-app browser
- WhatsApp in-app browser

Test listesi:

- ilk acilis hizi
- hero crop
- kategori drawer
- urun detay sheet
- telefonla siparis akisi
- WhatsApp / Google yonlendirmeleri
- oyun performansi
- uzun sayfada scroll
- alt nav tasmasi
- dil degisimi

## 7. Yayin / domain / QR

Gerekenler:

- domain erisimi
- DNS erisimi
- hosting hedefi:
  - Vercel
  - Netlify
  - kendi sunucu
- canli URL formati:
  - `/real-kebab-istanbul/masa-1`
- QR uretilecek masa listesi
- PWA ikonlari

## 8. Sira

En dogru uygulama sirasi bu:

1. restoran profil datasi
2. menu CSV doldurma
3. gercek urun gorselleri
4. Supabase env ve migration
5. veri importu
6. admin panel
7. mobil QA
8. domain / QR / publish

## 8.1 Su an tek basima tamamlanan hazirliklar

- Lokal build kontrol edildi ve proje basariyla derleniyor.
- Admin route hazir:
  - `/admin/real-kebab-istanbul`
  - `/real-kebab-istanbul/admin`
- Admin panel Supabase olmadiginda net uyari gosteriyor.
- PWA manifest ve service worker dosyalari hazir.
- Vercel/Netlify deep-link yonlendirme dosyalari hazir.
- QR baski araci eklendi:
  - lokal: `/qr.html`
  - yayindan sonra: `https://domain/qr.html`
- QR baski araci logo, adres, Wi-Fi ve ozel masa etiketi destekliyor.
- README dosyasi guncel calistirma, build, Supabase ve QR notlariyla temizlendi.
- Demo menu CSV export dosyasi hazir:
  - `docs/menu-export-demo.csv`
- CSV doldurma rehberi hazir:
  - `docs/menu-import-guide.md`
- Demo Supabase seed dosyasi hazir:
  - `supabase/seed.demo-generated.sql`
- Deploy oncesi otomatik kontrol komutu hazir:
  - `npm run preflight`
- Restoran sahibine gosterilecek demo sunum notu hazir:
  - `docs/customer-demo-brief.md`
- Mobil QA raporu hazir:
  - `docs/mobile-qa-report.md`

## 8.2 Dis bilgi veya hesap erisimi bekleyenler

- Gercek domain ve DNS erisimi.
- Supabase proje URL ve anon key.
- Supabase migration calistirma yetkisi.
- Restoran sahibinin admin kullanici e-postasi.
- Gercek menu/fiyat onayi.
- Gercek urun gorselleri.
- Google yorum linki veya Place ID.
- Masa sayisi ve masa etiketleri.

## 9. Benden hemen yapabileceklerin

Ben hic beklemeden su uc seyi baslatabilirim:

1. Supabase seed/template yapisini gercek veriye hazir hale getirmek
2. admin panel skeleton'unu cikarip auth baglamak
3. PWA manifest + service worker + install flow eklemek

En verimli sonraki adim:

- restoran profili + menu CSV + linkler
