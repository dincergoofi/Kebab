import { useEffect, useMemo } from "react";
import Icon from "./Icon.jsx";
import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";

const CATEGORY_ICONS = {
  principales: "skewer",
  "fast-food": "sides",
  especiales: "special",
  postres: "baklava",
  bebidas: "bottle"
};

export default function CategoryDrawer({
  isOpen,
  restaurant,
  categories,
  products,
  selectedCategoryId,
  language,
  copy,
  onSelect,
  onClose
}) {
  const counts = useMemo(
    () =>
      products.reduce((accumulator, product) => {
        accumulator[product.category_id] = (accumulator[product.category_id] || 0) + 1;
        return accumulator;
      }, {}),
    [products]
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="drawer-layer" role="presentation" onClick={onClose}>
      <aside
        className="category-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={copy.menuDrawer}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-hero">
          <img src={restaurant.cover_image_url || PLACEHOLDER_IMAGES.openingPoster} alt="" />
          <button type="button" className="drawer-close" onClick={onClose} aria-label={copy.closeMenu}>
            X
          </button>
          <div>
            <span>{restaurant.name}</span>
            <strong>{copy.menuDrawer}</strong>
          </div>
        </div>

        <nav className="drawer-list" aria-label={copy.menuDrawer}>
          {categories.map((category) => {
            const name = localized(category, "name", language);
            const isActive = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className={`drawer-category ${isActive ? "is-active" : ""}`}
                onClick={() => onSelect(category.id)}
              >
                <span className="drawer-category-icon">
                  <Icon name={CATEGORY_ICONS[category.id] || "star"} size={18} />
                </span>
                <span>
                  <strong>{name}</strong>
                  <small>
                    {counts[category.id] || 0} {copy.productsLabel}
                  </small>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
