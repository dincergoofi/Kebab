# Menu CSV Import Rehberi

Bu rehber `docs/menu-export-demo.csv` veya `docs/menu-import-template.csv` dosyasini gercek menuye cevirirken kullanilir.

## Dosyalar

- `docs/menu-export-demo.csv`: Su anki demo menuden uretilmis dolu ornek.
- `docs/menu-import-template.csv`: Bos/detayli import sablonu.
- `npm run export:data`: Demo CSV ve Supabase seed dosyasini yeniden uretir.

## Zorunlu Alanlar

Her urunde su alanlar dolu olmalı:

- `category_id`
- `category_es`
- `product_id`
- `name_es`
- `name_tr`
- `name_en`
- `description_es`
- `price_eur`
- `is_available`
- `is_signature`
- `sales_priority`
- `order_index`

## Fiyat Kurallari

- Fiyat sadece sayi olmali: `8.50`, `6.00`, `2.50`
- Para birimi yazilmaz; sistem EUR kabul eder.
- Virgül yerine nokta kullanilir.
- Final kontrol: restoran sahibinden fiyat onayi alinmadan import yapilmaz.

## Boolean Alanlar

Su alanlarda `yes` veya `no` kullan:

- `is_available`
- `is_signature`

Anlamlari:

- `is_available=yes`: urun musteride gorunur.
- `is_available=no`: urun gizlenir/stok disi gibi davranir.
- `is_signature=yes`: one cikan urun olarak tasarimda daha fazla vurgulanir.

## Satis Onceligi

`sales_priority` 0-100 arasinda bir sayidir.

- `90-100`: vitrin/one cikan urun
- `70-89`: guclu tavsiye
- `40-69`: normal urun
- `0-39`: dusuk oncelik

## Sira

`order_index` kategori icindeki siralamadir.

Oneri:

- 10, 20, 30 gibi bosluklu kullan.
- Araya yeni urun girilecekse 25 gibi ara deger eklenebilir.

## Icerik ve Alerjen

Icerik alanlarinda noktalı virgül kullan:

```text
carne kebab; arroz; ensalada
```

Alerjen alaninda da ayni format:

```text
gluten; lactosa
```

Alerjen yoksa bos birak.

## Gorsel URL

`image_url` icin iki yol var:

- Lokal public dosyasi: `/brand/dish-kebab-rollo.png`
- Canli CDN/storage linki: `https://...`

Supabase Storage baglandiktan sonra gercek urun gorselleri bu alana yazilir.

## Import Oncesi Kontrol

1. Tum fiyatlar nokta ile yazildi mi?
2. `name_es` bos urun var mi?
3. Kategori adlari tutarli mi?
4. `is_available` ve `is_signature` sadece `yes/no` mu?
5. `sales_priority` 0-100 arasinda mi?
6. En az ana urunlerin gorselleri var mi?
7. Restoran sahibi fiyat listesini onayladi mi?

## Hızlı Komutlar

Demo export yeniden uret:

```bash
npm run export:data
```

Deploy oncesi kontrol:

```bash
npm run preflight
```
