import { useMemo } from "react";
import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";
import { repairMojibake } from "../utils/text.js";

const HERO_PRIORITY_IDS = [
  "kebab-pan",
  "kebab-rollo",
  "pizza-kebab",
  "papas-horno",
  "plato-kebab-patatas",
  "dulce-pistacho",
  "refrescos"
];

function pickHeroImages(products = [], restaurant) {
  const images = [];

  for (const id of HERO_PRIORITY_IDS) {
    const match = products.find((product) => product.id === id && product.image_url);
    if (match?.image_url && !images.includes(match.image_url)) {
      images.push(match.image_url);
    }
  }

  for (const product of products) {
    if (product?.image_url && !images.includes(product.image_url)) {
      images.push(product.image_url);
    }

    if (images.length >= 6) {
      break;
    }
  }

  if (restaurant?.cover_image_url && !images.includes(restaurant.cover_image_url)) {
    images.unshift(restaurant.cover_image_url);
  }

  return images.slice(0, 6);
}

export default function WelcomeCover({ restaurant, products = [], language, copy, onLanguageChange, onOpenMenu }) {
  const socialLinks = Array.isArray(restaurant.social_links) ? restaurant.social_links.filter((link) => link?.url) : [];
  const tagline = localized(restaurant, "tagline", language);
  const venueName = repairMojibake(restaurant.name || "");
  const city = repairMojibake(restaurant.city || "");
  const titleWords = venueName.split(/\s+/).filter(Boolean);
  const titleLead = titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : "";
  const titleAccent = titleWords.length > 1 ? titleWords.at(-1) : venueName;
  const heroBadge = city ? `${city}${restaurant.country_code ? ` / ${restaurant.country_code}` : ""}` : copy.menu;
  const heroGalleryImages = useMemo(() => pickHeroImages(products, restaurant), [products, restaurant]);
  const marqueeImages = heroGalleryImages.length ? [...heroGalleryImages, ...heroGalleryImages] : [];

  return (
    <section className="welcome-cover brand-home" id="welcome" aria-label={venueName}>
      <img
        className="brand-home-bg"
        src={restaurant.cover_image_url || PLACEHOLDER_IMAGES.openingPoster}
        alt=""
      />
      <div className="hero-pattern" aria-hidden="true" />
      <div className="hero-sheen" aria-hidden="true" />
      <div className="hero-embers" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {marqueeImages.length ? (
        <div className="hero-gallery" aria-hidden="true">
          <div className="hero-gallery-track">
            {marqueeImages.map((image, index) => (
              <span key={`${image}-${index}`} className="hero-gallery-item">
                <img src={image} alt="" />
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {socialLinks.length ? (
        <div className="hero-social" aria-label="Social">
          {socialLinks.map((link) => (
            <a key={link.label || link.url} href={link.url} target="_blank" rel="noreferrer">
              {repairMojibake(link.label || link.url)}
            </a>
          ))}
        </div>
      ) : null}

      <div className="brand-home-content">
        <img
          className="opening-logo"
          src={restaurant.logo_image_url || PLACEHOLDER_IMAGES.logoLuxe}
          alt=""
        />
        <span className="hero-badge">{heroBadge}</span>
        <h1>
          {titleLead ? <span>{titleLead}</span> : null}
          <strong>{titleAccent}</strong>
        </h1>
        <p>{tagline || copy.welcomeLead}</p>
        <button type="button" className="welcome-button" onClick={onOpenMenu}>
          {copy.startMenu}
        </button>
      </div>
    </section>
  );
}

