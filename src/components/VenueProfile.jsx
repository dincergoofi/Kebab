import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";

export default function VenueProfile({ restaurant, links, language, copy }) {
  const phone = restaurant.phone || restaurant.whatsapp_number || "";
  const coverImage = restaurant.cover_image_url || PLACEHOLDER_IMAGES.openingPoster;
  const logoImage = restaurant.logo_image_url || PLACEHOLDER_IMAGES.sign;
  const tagline = localized(restaurant, "tagline", language);
  const mapLink = links?.find((link) => link.kind === "maps");

  return (
    <section className="venue-profile" aria-label={restaurant.name}>
      <div className="venue-cover">
        <img src={coverImage} alt="" />
      </div>

      <div className="venue-panel">
        <img className="venue-logo" src={logoImage} alt={restaurant.name} />

        <div className="venue-copy">
          <p className="venue-status">{copy.openNow}</p>
          <h2>{restaurant.name}</h2>
          {tagline ? <p>{tagline}</p> : null}

          <div className="venue-info">
            {restaurant.hours ? (
              <span>
                <small>{copy.hoursLabel}</small>
                <strong>{restaurant.hours}</strong>
              </span>
            ) : null}

            {restaurant.address ? (
              <span>
                <small>{copy.addressLabel}</small>
                <strong>{restaurant.address}</strong>
              </span>
            ) : null}

            {phone ? (
              <span>
                <small>{copy.phoneLabel}</small>
                <strong>{phone}</strong>
              </span>
            ) : null}

            {restaurant.custom_link ? (
              <span>
                <small>{copy.customLinkLabel}</small>
                <strong>{restaurant.custom_link}</strong>
              </span>
            ) : null}
          </div>

          <div className="venue-actions">
            {phone ? (
              <a className="venue-action-button is-primary" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                {copy.phoneLabel}
              </a>
            ) : null}
            {mapLink ? (
              <a className="venue-action-button" href={mapLink.url} target="_blank" rel="noreferrer">
                {copy.addressLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
