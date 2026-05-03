# Real Kebab Istanbul QR Platform

Bu proje, restoran masalarindaki tek QR koddan acilan mobil oncelikli bir menu uygulamasidir. Demo veriyle hemen calisir; Supabase baglandiginda restoran, kategori, urun, yorum, skor ve admin verileri veritabanindan gelir.

## Urun Ozeti

- Tek QR girisi: `/:restaurantSlug/:tableCode`
- Varsayilan musteri dili: Ispanyolca
- Ek diller: Turkce ve Ingilizce
- Ana akista menu, kategori gezme, urun detayi, favori, telefonla siparis, yorum ve bekleme oyunu var.
- Admin yolu hazir: `/admin/real-kebab-istanbul` veya `/real-kebab-istanbul/admin`
- Supabase yoksa demo veriyle calisir, admin panel Supabase bilgisi ister.
- PWA manifest ve servis worker hazir.
- Vercel/Netlify derin route destegi hazir.

## Lokal Calistirma

```bash
npm install
npm run dev
```

Ornek URL:

```text
http://localhost:5173/real-kebab-istanbul/masa-1
```

Admin URL:

```text
http://localhost:5173/admin/real-kebab-istanbul
```

## Build

```bash
npm run build
```

Windows PowerShell `npm.ps1` engeline takilirsa:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run build
```

## Supabase Baglama

`.env.example` dosyasini `.env` olarak kopyalayip gercek degerleri girin:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_DEFAULT_RESTAURANT_SLUG=real-kebab-istanbul
```

Migration sirasi:

```text
supabase/migrations/202604130001_initial_schema.sql
supabase/migrations/202605020002_restaurant_profile_columns.sql
supabase/migrations/202605020003_restaurant_admins_and_policies.sql
```

Admin kurulumu icin: `docs/admin-setup.md`

## QR Hazirligi

Canli URL olusunca toplu QR baski sayfasi:

```text
/qr.html
```

Lokal test:

```text
http://localhost:5173/qr.html
```

Bu sayfada base URL, masa sayisi ve restoran slug girilerek print-ready QR kartlari uretilir.

## Canliya Alma Sirası

Detayli liste: `docs/launch-checklist.md`

Kisa sira:

1. Restoran profil datasini kesinlestir.
2. Menu CSV dosyasini gercek urunlerle doldur.
3. Gercek urun gorsellerini ekle.
4. Supabase env ve migration kurulumunu yap.
5. Veriyi Supabase'e import et.
6. Admin panel login/kayitlarini bagla.
7. Mobil QA yap.
8. Domain, hosting ve QR baskisini tamamla.

## Onemli Dosyalar

- `src/App.jsx`: ana uygulama akisi
- `src/data/demoExperience.js`: demo restoran/menu verisi
- `src/components/AdminPanel.jsx`: admin panel arayuzu
- `src/components/OrderRushGame.jsx`: oyun deneyimi
- `docs/launch-checklist.md`: yayina alma listesi
- `DEPLOYMENT.md`: public deploy notlari
- `public/qr.html`: QR baski araci
