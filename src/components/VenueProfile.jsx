import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";
import { getOpenStatus } from "../utils/hours.js";
import { repairMojibake } from "../utils/text.js";

export default function VenueProfile({ restaurant, links, language, copy }) {
  const phone = repairMojibake(restaurant.phone || restaurant.whatsapp_number || "");
  const venueName = repairMojibake(restaurant.name || "");
  const hours = repairMojibake(restaurant.hours || "");
  const address = repairMojibake(restaurant.address || "");
  const customLink = repairMojibake(restaurant.custom_link || "");
  const coverImage = restaurant.cover_image_url || PLACEHOLDER_IMAGES.openingPoster;
  const logoImage = restaurant.logo_image_url || PLACEHOLDER_IMAGES.sign;
  const tagline = localized(restaurant, "tagline", language);
  const mapLink = links?.find((link) => link.kind === "maps");
  const openStatus = getOpenStatus(restaurant.hours);
  const statusLabel =
    openStatus === "open" ? copy.openNow :
    openStatus === "closed" ? copy.closedNow :
    null;
  const statusClass =
    openStatus === "open" ? "venue-status is-open" :
    openStatus === "closed" ? "venue-status is-closed" :
    "venue-status";

  return (
    <section className="venue-profile" aria-label={venueName}>
      <div className="venue-cover">
        <img src={coverImage} alt="" />
      </div>

      <div className="venue-panel">
        <img className="venue-logo" src={logoImage} alt={venueName} />

        <div className="venue-copy">
          {statusLabel ? <p className={statusClass}>{statusLabel}</p> : null}
          <h2>{venueName}</h2>
          {tagline ? <p>{tagline}</p> : null}

          <div className="venue-info">
            {hours ? (
              <span>
                <small>{copy.hoursLabel}</small>
                <strong>{hours}</strong>
              </span>
            ) : null}

            {address ? (
              <span>
                <small>{copy.addressLabel}</small>
                <strong>{address}</strong>
              </span>
            ) : null}

            {phone ? (
              <span>
                <small>{copy.phoneLabel}</small>
                <strong>{phone}</strong>
              </span>
            ) : null}

            {customLink ? (
              <span>
                <small>{copy.customLinkLabel}</small>
                <strong>{customLink}</strong>
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
