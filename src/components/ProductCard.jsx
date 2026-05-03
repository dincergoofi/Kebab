import Icon from "./Icon.jsx";
import { localized } from "../utils/localization.js";
import { formatMenuPrice } from "../utils/money.js";

function SpiceMeter({ level, label }) {
  const safeLevel = Math.max(0, Math.min(Number(level || 0), 3));

  return (
    <span className="spice-meter" aria-label={`${label}: ${safeLevel}`}>
      {[1, 2, 3].map((item) => (
        <span key={item} className={item <= safeLevel ? "is-active" : ""} />
      ))}
    </span>
  );
}

export default function ProductCard({ product, language, copy, isFavorite, onView, onFavoriteToggle, onOpenDetail }) {
  const name = localized(product, "name", language);
  const description = localized(product, "description", language);
  const ingredients = product.ingredients?.[language] || [];
  const badge = localized(product, "badge", language);
  const isPopular = product.is_signature || product.sales_priority >= 80;
  const classes = [
    "menu-item",
    "native-card",
    "pressable-card",
    product.is_signature ? "is-signature" : "",
    product.is_anchor ? "is-anchor" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={classes}
      tabIndex="0"
      onMouseEnter={() => onView(product)}
      onFocus={() => onView(product)}
      onClick={() => onOpenDetail(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail(product);
        }
      }}
    >
      <div className="product-image-wrap">
        <img src={product.image_url} alt={name} loading="lazy" />
      </div>

      <div className="menu-item-body">
        <div className="item-title-row">
          <div>
            <div className="badge-row">
              {badge ? <span className="menu-badge">{badge}</span> : null}
              {isPopular ? <span className="menu-badge soft">{copy.popularBadge}</span> : null}
            </div>
            <h3>{name}</h3>
          </div>

          <button
            type="button"
            className={`favorite-button ${isFavorite ? "is-active" : ""}`}
            aria-label={isFavorite ? copy.removeFavorite : copy.addFavorite}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onFavoriteToggle(product);
            }}
          >
            <Icon name="heart" size={18} />
          </button>
        </div>

        <p>{description}</p>

        <div className="product-tags" aria-label={copy.productInfo}>
          <span>{copy.caloriesLabel}: {product.calories || "?"} kcal</span>
          <span>
            {copy.spiceLabel}
            <SpiceMeter level={product.spice_level} label={copy.spiceLabel} />
          </span>
          {product.allergens?.length > 0 ? (
            <span>{copy.allergens}: {product.allergens.join(", ")}</span>
          ) : (
            <span>{copy.noAllergens}</span>
          )}
        </div>

        {ingredients.length > 0 ? (
          <p className="ingredients">
            {copy.ingredients}: {ingredients.join(", ")}
          </p>
        ) : null}

        <div className="menu-meta">
          <span className="price">
            {formatMenuPrice(product.price, language)}
            <span className="price-currency">{product.currency === "EUR" ? " EUR" : ` ${product.currency}`}</span>
          </span>
          {!product.is_available ? <span className="availability">{copy.unavailable}</span> : null}
        </div>
      </div>
    </article>
  );
}
