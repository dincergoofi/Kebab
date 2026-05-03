import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";

export default function WelcomeCover({ restaurant, language, copy, onLanguageChange, onOpenMenu }) {
  const socialLinks = restaurant.social_links || [];
  const tagline = localized(restaurant, "tagline", language);

  return (
    <section className="welcome-cover brand-home" id="welcome">
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
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
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
        <span className="hero-badge">Authentic Turkish Taste</span>
        <h1>
          <span>Real Istanbul</span>
          <strong>Kebab</strong>
        </h1>
        <p>{tagline || copy.welcomeLead}</p>
        <button type="button" className="welcome-button" onClick={onOpenMenu}>
          {copy.startMenu}
        </button>
      </div>
    </section>
  );
}
