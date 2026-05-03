function orderCopy(language) {
  if (language === "tr") {
    return {
      eyebrow: "Siparis",
      title: "Telefonla siparis ver",
      lead: "Bu isletme siparislerini dogrudan telefon uzerinden aliyor.",
      note: "Tek bir arama ile siparisinizi hizlica olusturabilirsiniz.",
      primary: "Hemen ara",
      phoneLabel: "Siparis hatti",
      hoursLabel: "Siparis saatleri"
    };
  }

  if (language === "en") {
    return {
      eyebrow: "Order",
      title: "Order by phone",
      lead: "This venue takes orders directly by phone.",
      note: "A quick call is all it takes to place your order.",
      primary: "Call now",
      phoneLabel: "Order line",
      hoursLabel: "Order hours"
    };
  }

  return {
    eyebrow: "Pedir",
    title: "Pide por telefono",
    lead: "Este local toma los pedidos directamente por telefono.",
    note: "Una llamada rapida y tu pedido queda hecho al momento.",
    primary: "Llamar ahora",
    phoneLabel: "Linea de pedidos",
    hoursLabel: "Horario de pedidos"
  };
}

function orderBadges(language) {
  if (language === "tr") {
    return ["Direkt hat", "Hizli arama", "Masadan kolay"];
  }

  if (language === "en") {
    return ["Direct line", "Fast call", "Easy from table"];
  }

  return ["Linea directa", "Llamada rapida", "Facil desde mesa"];
}

function normalizePhone(phone) {
  return (phone || "").replace(/[^\d+]/g, "");
}

export default function DeliveryLinksSection({ restaurant, language = "es", onCallOrder }) {
  const copy = orderCopy(language);
  const badges = orderBadges(language);
  const phone = restaurant.phone || restaurant.whatsapp_number || "";
  const tel = normalizePhone(phone);

  if (!phone) {
    return null;
  }

  return (
    <section className="delivery-band" id="delivery">
      <div className="delivery-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>

      <div className="delivery-stage phone-only">
        <div className="delivery-spotlight-card">
          <small>{copy.eyebrow}</small>
          <strong>{copy.title}</strong>
          <p>{copy.note}</p>

          <div className="delivery-badges">
            {badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>

        <a className="delivery-phone-card" href={`tel:${tel}`} onClick={() => onCallOrder?.({ phone })}>
          <small>{copy.phoneLabel}</small>
          <strong>{phone}</strong>
          {restaurant.hours ? (
            <span>
              {copy.hoursLabel}: {restaurant.hours}
            </span>
          ) : null}
          <em>{copy.primary}</em>
        </a>
      </div>
    </section>
  );
}
