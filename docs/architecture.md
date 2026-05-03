# Architecture

## Shape

The app is a menu-first single-entry QR experience:

```text
/:restaurantSlug/:tableCode
```

The first viewport prioritizes category tabs, products, prices and availability. Spanish is the default language for San Fernando; Turkish and English stay available from the header. Feedback, support and game flows are present, but secondary.

The welcome cover is a brand entry screen inspired by premium digital menu products. It adds one clear action only: open the menu.

## Frontend

Main layers:

- `src/App.jsx`: orchestration and route-level state.
- `src/components`: reusable UI surfaces.
- `src/data`: demo data and language copy.
- `src/services`: Supabase, reputation, telemetry and experience APIs.
- `src/utils`: routing, localization and money formatting.
- `public/placeholders`: temporary menu visuals.

## QR And App Compatibility

The QR points to a normal HTTPS route, so it works from iOS Camera, Android camera apps, WhatsApp, Instagram, Google Lens and browser QR scanners. External actions are stored as normal HTTPS links, including `wa.me` for WhatsApp and delivery platform URLs.

`restaurant_links` makes Glovo, Uber Eats, WhatsApp, Google Maps or future platforms editable without changing the printed QR code.

## Menu Engineering

Products can carry menu-engineering fields:

- `is_signature`: visually prioritized, high-profit or signature item.
- `is_anchor`: premium/decoy-style anchor that makes nearby high-value items feel more reasonable.
- `badge_tr/es/en`: short menu badge such as "Especialidad" or "Recomendado".
- `sales_priority`: future analytics/admin sorting field.

Prices are shown with a small currency mark so the guest focuses on the product first, not the payment symbol.

## Theme

The guest can switch between day and night mode. The preference is stored locally, and the first load respects the device color preference.

## Backend

Supabase is the source of truth once `.env` is configured. Public reads are allowed only for active restaurants, active categories, available products and leaderboard rows.

Critical writes go through RPC:

- `create_guest_session`
- `track_session_event`
- `create_feedback`
- `create_game_result`

This keeps table resolution, score validation and promo-code generation on the database side.

## Reputation Flow

The safe behavior is not hard review gating.

```text
4-5 stars: Google is primary, internal save is secondary.
1-3 stars: WhatsApp recovery is primary, Google remains available.
```

This keeps the flow transparent while still helping the restaurant solve bad experiences before the customer leaves.

## Game Loop

The game is an order-preparation challenge. A customer arrives with a doner order, the player taps the required preparation steps in sequence, and patience drops every second. Correct orders increase score and combo; wrong ingredients reduce score and patience.

This keeps the game tied to the actual restaurant experience instead of feeling like an unrelated mini game.

## Placeholder Photo Strategy

The current menu uses local SVG placeholders. They are intentionally neutral and easy to replace. When the owner approves the app, product records can point to real uploaded photos without changing React components.

## Next Production Steps

1. Admin panel for categories, products, prices and stock.
2. Signed image upload flow.
3. Low-rating staff alert.
4. QR batch generator for tables.
5. Analytics dashboard from `session_events`.
