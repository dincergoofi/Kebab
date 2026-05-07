import { useState } from "react";
import Icon from "./Icon.jsx";
import { localized } from "../utils/localization.js";
import { formatMenuPrice } from "../utils/money.js";

function SpiceMeter({ level }) {
  const safeLevel = Math.max(0, Math.min(Number(level || 0), 3));

  return (
    <span className="spice-meter">
      {[1, 2, 3].map((item) => (
        <span key={item} className={item <= safeLevel ? "is-active" : ""} />
      ))}
    </span>
  );
}

function detailLabels(language) {
  if (language === "tr") {
    return {
      orderNow: "Siparis kanallarina git",
      share: "Urunu paylas",
      shared: "Paylasim hazir",
      allergenTitle: "Alerjen bilgisi",
      allergenEmpty: "Bu urun icin isaretli alerjen yok.",
      allergenNote: "Gida alerjiniz varsa siparis vermeden once personelden teyit isteyin. Mutfakta capraz temas olabilir."
    };
  }

  if (language === "en") {
    return {
      orderNow: "Open order channels",
      share: "Share item",
      shared: "Share ready",
      allergenTitle: "Allergen information",
      allergenEmpty: "No marked allergens for this item.",
      allergenNote: "If you have a food allergy, please confirm with staff before ordering. Cross-contact may occur in the kitchen."
    };
  }

  return {
    orderNow: "Abrir canales de pedido",
    share: "Compartir plato",
    shared: "Listo para compartir",
    allergenTitle: "Informacion sobre alergenos",
    allergenEmpty: "No hay alergenos marcados para este producto.",
    allergenNote: "Si tienes una alergia alimentaria, confirma con el personal antes de pedir. Puede haber contacto cruzado en cocina."
  };
}

export default function ProductDetailSheet({
  product,
  language,
  copy,
  isFavorite,
  recommendations,
  onClose,
  onFavoriteToggle,
  onSelectProduct,
  onJumpToOrder
}) {
  const [shareState, setShareState] = useState("idle");

  if (!product) {
    return null;
  }

  const labels = detailLabels(language);
  const name = localized(product, "name", language);
  const description = localized(product, "description", language);
  const ingredients = product.ingredients?.[language] || [];
  const badge = localized(product, "badge", language);

  async function shareProduct() {
    const shareData = {
      title: name,
      text: `${name} • ${description}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      }

      setShareState("done");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("idle");
    }
  }

  return (
    <div className="detail-backdrop" role="presentation" onClick={onClose}>
      <section
        className="detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={name}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="sheet-close" onClick={onClose} aria-label={copy.closeDetail}>
          <Icon name="close" size={20} />
        </button>

        <div className="sheet-image-wrap">
          <img className="sheet-image" src={product.image_url} alt={name} />
          <span className="sheet-image-shade" aria-hidden="true" />
          <div className="sheet-hero-copy">
            <div className="sheet-title">
              <div>
                <div className="sheet-badge-row">
                  {badge ? <span className="menu-badge">{badge}</span> : null}
                  {product.is_signature ? <span className="menu-badge soft">{copy.popularBadge}</span> : null}
                </div>
                <h2>{name}</h2>
              </div>
              <strong className="price">
                {formatMenuPrice(product.price, language)}
                <span className="price-currency">{product.currency === "EUR" ? " EUR" : ` ${product.currency}`}</span>
              </strong>
            </div>

            <p>{description}</p>
          </div>
        </div>

        <div className="sheet-body">
          <div className="detail-facts">
            <span>{copy.caloriesLabel}: {product.calories || "?"} kcal</span>
            <span>
              {copy.spiceLabel}
              <SpiceMeter level={product.spice_level} />
            </span>
          </div>

          {ingredients.length ? (
            <div className="sheet-section">
              <strong>{copy.ingredients}</strong>
              <p>{ingredients.join(", ")}</p>
            </div>
          ) : null}

          <div className="sheet-section allergen-section">
            <strong>{labels.allergenTitle}</strong>
            {product.allergens?.length ? (
              <div className="allergen-chip-list" aria-label={copy.allergens}>
                {product.allergens.map((allergen) => (
                  <span key={allergen}>{allergen}</span>
                ))}
              </div>
            ) : (
              <p>{labels.allergenEmpty}</p>
            )}
            <small>{labels.allergenNote}</small>
          </div>

          <div className="sheet-actions-row">
            <button
              type="button"
              className="primary-button sheet-order-button"
              onClick={() => {
                onClose();
                onJumpToOrder();
              }}
            >
              {labels.orderNow}
            </button>

            <div className="sheet-secondary-actions">
              <button type="button" className="ghost-button favorite-wide" onClick={() => onFavoriteToggle(product)}>
                <Icon name="heart" size={18} />
                {isFavorite ? copy.removeFavorite : copy.addFavorite}
              </button>

              <button type="button" className="ghost-button share-button" onClick={shareProduct}>
                <Icon name="share" size={18} />
                {shareState === "done" ? labels.shared : labels.share}
              </button>
            </div>
          </div>

          {recommendations.length ? (
            <div className="sheet-section">
              <strong>{copy.recommendationsTitle}</strong>
              <div className="sheet-recommendations">
                {recommendations.map((item) => (
                  <button key={item.id} type="button" onClick={() => onSelectProduct(item)}>
                    <img src={item.image_url} alt="" />
                    <span>{localized(item, "name", language)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
