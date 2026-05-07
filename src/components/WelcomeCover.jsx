import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";
import { repairMojibake } from "../utils/text.js";

export default function WelcomeCover({ restaurant, language, copy, onLanguageChange, onOpenMenu }) {
  const socialLinks = Array.isArray(restaurant.social_links) ? restaurant.social_links.filter((link) => link?.url) : [];
  const tagline = localized(restaurant, "tagline", language);
  const venueName = repairMojibake(restaurant.name || "");
  const city = repairMojibake(restaurant.city || "");
  const titleWords = venueName.split(/\s+/).filter(Boolean);
  const titleLead = titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : "";
  const titleAccent = titleWords.length > 1 ? titleWords.at(-1) : venueName;
  const heroBadge = city ? `${city}${restaurant.country_code ? ` / ${restaurant.country_code}` : ""}` : copy.menu;

  return (
    <section className="welcome-cover brand-home" id="welcome" aria-label={venueName}>
      <img
        className="brand-home-bg"
        src={restaurant.cover_image_url || PLACEHOLDER_IMAGES.openingPoster}
        alt=""
      />
      <div className="hero-pattern" aria-hidden="true" />
      <div className="hero-embers" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

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
