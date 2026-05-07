import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";
import { getHoursRows, getOpenStatus } from "../utils/hours.js";
import { repairMojibake } from "../utils/text.js";

export default function VenueProfile({ restaurant, links, language, copy }) {
  const phone = repairMojibake(restaurant.phone || restaurant.whatsapp_number || "");
  const venueName = repairMojibake(restaurant.name || "");
  const hours = repairMojibake(restaurant.hours || "");
  const hoursRows = getHoursRows(hours);
  const address = repairMojibake(restaurant.address || "");
  const customLink = repairMojibake(restaurant.custom_link || "");
  const coverImage = restaurant.cover_image_url || PLACEHOLDER_IMAGES.openingPoster;
  const logoImage = restaurant.logo_image_url || PLACEHOLDER_IMAGES.sign;
  const tagline = localized(restaurant, "tagline", language);
  const mapLink = links?.find((link) => link.kind === "maps");
  const openStatus = getOpenStatus(hours);
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
          <h2>{venueName}</h2>
          {tagline ? <p>{tagline}</p> : null}

          <div className="venue-info">
            {hours ? (
              <div className="venue-info-card is-hours">
                <div className="venue-hours-head">
                  <small>{copy.hoursLabel}</small>
                  {statusLabel ? <span className={statusClass}>{statusLabel}</span> : null}
                </div>

                {hoursRows.length ? (
                  <div className="venue-hours-list">
                    {hoursRows.map((row) => (
                      <div key={`${row.label}-${row.detail}`} className={`venue-hours-row ${row.isToday ? "is-today" : ""}`}>
                        <span className="venue-hours-day">{row.label}</span>
                        <strong>{row.detail}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <strong>{hours}</strong>
                )}
              </div>
            ) : null}

            {address ? (
              <div className="venue-info-card">
                <small>{copy.addressLabel}</small>
                <strong>{address}</strong>
              </div>
            ) : null}

            {phone ? (
              <div className="venue-info-card">
                <small>{copy.phoneLabel}</small>
                <strong>{phone}</strong>
              </div>
            ) : null}

            {customLink ? (
              <div className="venue-info-card">
                <small>{copy.customLinkLabel}</small>
                <strong>{customLink}</strong>
              </div>
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
