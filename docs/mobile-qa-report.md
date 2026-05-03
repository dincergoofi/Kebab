# Mobil QA Raporu

Son guncelleme: 2026-05-03

## Kontrol Edilen Ekranlar

- Ana QR menu: `/real-kebab-istanbul/masa-1`
- Admin panel: `/admin/real-kebab-istanbul`
- QR baski araci: `/qr.html`

## Mevcut Durum

- Production build basarili.
- Ana uygulama konsol hatasi vermeden aciliyor.
- Demo admin panel Supabase olmadan aciliyor.
- QR baski araci dis servise bagli olmadan SVG QR uretiyor.

## Mobil Kontrol Listesi

- Header: logo, restoran adi, demo rozeti, siparis butonu, dil secimi ve tema butonu tek satirda fazla kalabalik olmamali.
- Hero: marka gorseli ilk ekranda anlasilir olmali; metinler birbirini kapatmamalı.
- Alt nav: menu, siparis, oyun, puan ikonlari sabit kalmali ve uzun metin tasirmamali.
- Kategori kartlari: dokunma alanlari en az 44px olmali.
- Urun detay sheet: kapatma, favori ve siparis aksiyonlari parmakla rahat tiklanmali.
- Telefon siparis: `tel:` linki mobilde telefon uygulamasini acmali.
- Google/WhatsApp linkleri: yeni uygulama/tarayici gecisleri test edilmeli.
- Oyun: canvas alaninda hareket ve dokunma akisi mobilde takilmamali.
- Admin demo: fiyat, gorunurluk ve one cikan checkboxlari mobilde tasma yapmamali.
- QR araci: form alanlari mobilde tek kolon olmali; kartlar baskida iki kolon, mobilde tek kolon gibi okunmali.

## Manuel Cihaz Testi Bekleyenler

- iPhone Safari.
- Android Chrome.
- Instagram in-app browser.
- WhatsApp in-app browser.
- Mobil veri uzerinden final domain testi.

## Duzeltilenler

- QR baski araci mobil tek kolon olacak sekilde ayarlandi.
- QR kodlari dis API beklemeden sayfa icinde uretiliyor.
- Admin panel Supabase yokken bos uyari ekrani yerine demo workspace aciyor.
- README ve launch checklist canliya hazirlik icin temizlendi.

## Kalan Riskler

- Gercek domain henuz bagli degil.
- Supabase env henuz girilmedi.
- Gercek urun gorselleri ve fiyat onayi bekliyor.
- Final QR baskisi canli domain mobil veriyle test edilmeden yapilmamali.
