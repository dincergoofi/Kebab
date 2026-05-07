import { repairMojibake } from "../utils/text.js";

function channelCopy(language) {
  if (language === "tr") {
    return {
      whatsappTitle: "WhatsApp",
      whatsappLead: "Mekana dogrudan yaz ve hizli cevap al.",
      whatsappAction: "Sohbeti ac",
      mapsTitle: "Konum",
      mapsLead: "Yol tarifi ac ya da adresi paylas.",
      mapsAction: "Haritayi ac",
      websiteTitle: "Web sitesi",
      websiteLead: "Restoranin resmi sayfasini ac.",
      websiteAction: "Siteyi ac"
    };
  }

  if (language === "en") {
    return {
      whatsappTitle: "WhatsApp",
      whatsappLead: "Message the venue directly and get a quick reply.",
      whatsappAction: "Open chat",
      mapsTitle: "Location",
      mapsLead: "Open directions or share the venue address.",
      mapsAction: "Open map",
      websiteTitle: "Website",
      websiteLead: "Open the restaurant's official website.",
      websiteAction: "Open site"
    };
  }

  return {
    whatsappTitle: "WhatsApp",
    whatsappLead: "Habla con el local directamente y recibe respuesta rapida.",
    whatsappAction: "Abrir chat",
    mapsTitle: "Ubicacion",
    mapsLead: "Abre la ruta o comparte la direccion.",
    mapsAction: "Abrir mapa",
    websiteTitle: "Web",
    websiteLead: "Abre la web oficial del restaurante.",
    websiteAction: "Abrir web"
  };
}

function orderCopy(language) {
  if (language === "tr") {
    return {
      eyebrow: "Siparis",
      title: "Iletisim ve siparis",
      lead: "Telefon, WhatsApp, konum ve web baglantilarina tek yerden ulasin.",
      note: "Misafir hangi kanali tercih ederse etsin dogrudan size ulasir.",
      primary: "Hemen ara",
      phoneLabel: "Siparis hatti",
      hoursLabel: "Siparis saatleri"
    };
  }

  if (language === "en") {
    return {
      eyebrow: "Order",
      title: "Contact and order",
      lead: "Give guests one place for phone, WhatsApp, maps and website access.",
      note: "However they prefer to reach you, the next step stays clear.",
      primary: "Call now",
      phoneLabel: "Order line",
      hoursLabel: "Order hours"
    };
  }

  return {
    eyebrow: "Pedir",
    title: "Contacto y pedido",
    lead: "Telefono, WhatsApp, ubicacion y web oficial en un solo lugar.",
    note: "El cliente llega al canal correcto con un solo toque.",
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

function pickLinks(links = []) {
  return links.reduce((acc, link) => {
    if (link?.kind && !acc[link.kind]) {
      acc[link.kind] = link;
    }

    return acc;
  }, {});
}

export default function DeliveryLinksSection({ restaurant, links = [], language = "es", onCallOrder }) {
  const copy = orderCopy(language);
  const channel = channelCopy(language);
  const badges = orderBadges(language);
  const phone = repairMojibake(restaurant.phone || restaurant.whatsapp_number || "");
  const hours = repairMojibake(restaurant.hours || "");
  const tel = normalizePhone(phone);
  const channelLinks = pickLinks(links);
  const cards = [
    channelLinks.whatsapp
      ? {
          id: "whatsapp",
          className: "delivery-link delivery-link-whatsapp",
          badge: "WA",
          title: channel.whatsappTitle,
          lead: channel.whatsappLead,
          action: channel.whatsappAction,
          href: channelLinks.whatsapp.url
        }
      : null,
    channelLinks.maps
      ? {
          id: "maps",
          className: "delivery-link delivery-link-maps",
          badge: "MAP",
          title: channel.mapsTitle,
          lead: channel.mapsLead,
          action: channel.mapsAction,
          href: channelLinks.maps.url
        }
      : null,
    channelLinks.website
      ? {
          id: "website",
          className: "delivery-link delivery-link-website",
          badge: "WEB",
          title: channel.websiteTitle,
          lead: channel.websiteLead,
          action: channel.websiteAction,
          href: channelLinks.website.url
        }
      : null
  ].filter(Boolean);

  if (!phone && !cards.length) {
    return null;
  }

  return (
    <section className="delivery-band" id="delivery">
      <div className="delivery-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>

      <div className="delivery-stage">
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

        <div className="delivery-grid luxe">
          {phone ? (
            <a className="delivery-phone-card" href={`tel:${tel}`} onClick={() => onCallOrder?.({ phone })}>
              <small>{copy.phoneLabel}</small>
              <strong>{phone}</strong>
              {hours ? (
                <span>
                  {copy.hoursLabel}: {hours}
                </span>
              ) : null}
              <em>{copy.primary}</em>
            </a>
          ) : null}

          {cards.map((item) => (
            <a key={item.id} className={item.className} href={item.href} target="_blank" rel="noreferrer">
              <div className="delivery-link-top">
                <span>{item.badge}</span>
                <small>{item.title}</small>
              </div>
              <strong>{item.title}</strong>
              <p>{item.lead}</p>
              <em>{item.action}</em>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
