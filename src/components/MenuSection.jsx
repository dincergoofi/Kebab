import { useMemo, useState } from "react";
import Icon from "./Icon.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductDetailSheet from "./ProductDetailSheet.jsx";
import VenueProfile from "./VenueProfile.jsx";
import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { localized } from "../utils/localization.js";
import { formatMenuPrice } from "../utils/money.js";

const CATEGORY_ICONS = {
  principales: "mains",
  "fast-food": "sides",
  especiales: "special",
  postres: "dessert",
  bebidas: "drink"
};

function productMatchesQuery(product, query, language) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const haystack = [
    localized(product, "name", language),
    localized(product, "description", language),
    ...(product.ingredients?.[language] || []),
    ...(product.allergens || [])
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function productMatchesFilter(product, filter) {
  if (filter === "popular") {
    return product.is_signature || product.sales_priority >= 80;
  }

  if (filter === "mild") {
    return Number(product.spice_level || 0) <= 1;
  }

  if (filter === "no-allergens") {
    return !product.allergens?.length;
  }

  return true;
}

function sortProducts(a, b) {
  const signatureSort = Number(Boolean(b.is_signature)) - Number(Boolean(a.is_signature));
  if (signatureSort !== 0) {
    return signatureSort;
  }

  const prioritySort = Number(b.sales_priority || 0) - Number(a.sales_priority || 0);
  if (prioritySort !== 0) {
    return prioritySort;
  }

  return a.order_index - b.order_index;
}

function getProductGroup(product, language) {
  if (product.id.includes("menu")) {
    return language === "tr" ? "Menüler" : language === "en" ? "Menus" : "Menús";
  }

  if (product.category_id === "bebidas") {
    return language === "tr" ? "Icecekler" : language === "en" ? "Drinks" : "Bebidas";
  }

  if (product.category_id === "postres") {
    return language === "tr" ? "Tatlilar" : language === "en" ? "Desserts" : "Postres";
  }

  if (product.category_id === "fast-food") {
    return language === "tr" ? "Tamamlayicilar" : language === "en" ? "Sides" : "Complementos";
  }

  if (product.category_id === "especiales") {
    return language === "tr" ? "Imza Lezzetler" : language === "en" ? "Signature Plates" : "Especiales";
  }

  return language === "tr" ? "Tekli Lezzetler" : language === "en" ? "Single Items" : "Platos";
}

function groupProducts(products, language) {
  return products.reduce((groups, product) => {
    const label = getProductGroup(product, language);
    const currentGroup = groups.find((group) => group.label === label);

    if (currentGroup) {
      currentGroup.items.push(product);
    } else {
      groups.push({ label, items: [product] });
    }

    return groups;
  }, []);
}

function moodLabel(language) {
  if (language === "tr") {
    return "Ruh haline gore sec";
  }

  if (language === "en") {
    return "Choose by mood";
  }

  return "Elige por mood";
}

export default function MenuSection({
  restaurant,
  links,
  categories,
  products,
  selectedCategoryId,
  activeCategoryId,
  language,
  copy,
  gameEnabled,
  favoriteIds,
  onCategoryChange,
  onCategoryOpen,
  onCategoryClose,
  onProductView,
  onFavoriteToggle
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryCounts = useMemo(
    () =>
      products.reduce((counts, product) => {
        counts[product.category_id] = (counts[product.category_id] || 0) + 1;
        return counts;
      }, {}),
    [products]
  );

  const categoryHighlights = useMemo(
    () =>
      categories.map((category) => {
        const categoryProducts = products.filter((product) => product.category_id === category.id).sort(sortProducts);
        const heroProduct = categoryProducts[0];

        return {
          category,
          count: categoryProducts.length,
          image: heroProduct?.image_url
        };
      }),
    [categories, products]
  );

  const detailCategoryId = activeCategoryId || selectedCategoryId;
  const detailCategory = categories.find((category) => category.id === detailCategoryId);
  const detailCategoryImage = categoryHighlights.find(({ category }) => category.id === detailCategoryId)?.image;

  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => product.category_id === detailCategoryId)
        .filter((product) => productMatchesQuery(product, query, language))
        .filter((product) => productMatchesFilter(product, filter))
        .sort(sortProducts),
    [detailCategoryId, filter, language, products, query]
  );

  const groupedProducts = useMemo(() => groupProducts(filteredProducts, language), [filteredProducts, language]);

  const featuredProducts = useMemo(
    () =>
      products
        .filter((product) => product.is_signature || product.sales_priority >= 88)
        .sort(sortProducts)
        .slice(0, 5),
    [products]
  );

  const featuredHeroProduct = featuredProducts[0];
  const dailyPicks = featuredProducts.slice(1, 5);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.has(product.id)).sort(sortProducts),
    [favoriteIds, products]
  );

  const recommendations = useMemo(() => {
    if (!favoriteProducts.length) {
      return [];
    }

    const favoriteCategories = new Set(favoriteProducts.map((product) => product.category_id));

    return products
      .filter((product) => !favoriteIds.has(product.id))
      .filter((product) => favoriteCategories.has(product.category_id) || product.sales_priority >= 80)
      .sort(sortProducts)
      .slice(0, 3);
  }, [favoriteIds, favoriteProducts, products]);

  const selectedRecommendations = useMemo(() => {
    if (!selectedProduct) {
      return [];
    }

    return products
      .filter((product) => product.id !== selectedProduct.id)
      .filter((product) => product.category_id === selectedProduct.category_id || product.sales_priority >= 80)
      .sort(sortProducts)
      .slice(0, 3);
  }, [products, selectedProduct]);

  const filters = [
    { id: "all", label: copy.filterAll, icon: "star" },
    { id: "popular", label: copy.filterPopular, icon: "star" },
    { id: "mild", label: copy.filterMild, icon: "flame" },
    { id: "no-allergens", label: copy.filterNoAllergens, icon: "leaf" }
  ];

  return (
    <section className="menu-band menu-first" id="menu">
      {!activeCategoryId && featuredHeroProduct ? (
        <button
          type="button"
          className="featured-hero-card pressable-card"
          onClick={() => {
            onProductView(featuredHeroProduct);
            setSelectedProduct(featuredHeroProduct);
          }}
        >
          <img src={featuredHeroProduct.image_url} alt="" />
          <span className="featured-hero-shade" aria-hidden="true" />
          <span className="featured-hero-copy">
            <small>{copy.featuredTitle}</small>
            <strong>{localized(featuredHeroProduct, "name", language)}</strong>
            <span>{localized(featuredHeroProduct, "description", language)}</span>
          </span>
          <span className="featured-hero-price">
            {formatMenuPrice(featuredHeroProduct.price, language)}
            <small>{featuredHeroProduct.currency === "EUR" ? " EUR" : ` ${featuredHeroProduct.currency}`}</small>
          </span>
        </button>
      ) : null}

      {!activeCategoryId && dailyPicks.length ? (
        <div className="daily-picks" aria-label={copy.featuredTitle}>
          <div className="daily-picks-title">
            <small>{language === "tr" ? "Gunun onerisi" : language === "en" ? "Today's picks" : "Recomendado hoy"}</small>
            <strong>{copy.featuredLead}</strong>
          </div>

          <div className="daily-picks-scroll">
            {dailyPicks.map((product) => (
              <button
                key={product.id}
                type="button"
                className="daily-pick pressable-card"
                onClick={() => {
                  onProductView(product);
                  setSelectedProduct(product);
                }}
              >
                <img src={product.image_url} alt="" />
                <span>
                  <strong>{localized(product, "name", language)}</strong>
                  <small>{formatMenuPrice(product.price, language)} EUR</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="category-showcase" aria-label={copy.exploreCategories}>
        <div className="section-heading compact">
          <p className="eyebrow">{copy.menu}</p>
        </div>

        <div className="category-tile-grid">
          {categoryHighlights.map(({ category, count, image }) => (
            <button
              key={category.id}
              type="button"
              className={`category-tile pressable-card ${selectedCategoryId === category.id ? "is-active" : ""}`}
              onClick={() => onCategoryOpen(category.id)}
            >
              {image ? <img src={image} alt="" loading="lazy" /> : null}
              <span className="category-icon">
                <Icon name={CATEGORY_ICONS[category.id] || "star"} size={22} />
              </span>
              <span className="category-copy">
                <strong>{localized(category, "name", language)}</strong>
                <small>
                  {count} {copy.productsLabel}
                </small>
              </span>
            </button>
          ))}
        </div>

        {gameEnabled ? (
          <a className="menu-game-card pressable-card" href="#game">
            <span className="game-card-visual" aria-hidden="true">
              <img src={PLACEHOLDER_IMAGES.dishKebabRollo} alt="" />
            </span>
            <span className="game-card-copy">
              <small>{copy.gameWaitingLabel}</small>
              <strong>{copy.gameTitle}</strong>
              <span>{copy.gameCardSub}</span>
            </span>
            <span className="game-card-play" aria-hidden="true">
              <Icon name="play" size={18} />
            </span>
          </a>
        ) : null}
      </div>

      <VenueProfile restaurant={restaurant} links={links} language={language} copy={copy} />

      {favoriteProducts.length > 0 ? (
        <div className="recommendation-strip">
          <div>
            <span>{copy.favoritesTitle}</span>
            <strong>{favoriteProducts.map((product) => localized(product, "name", language)).join(", ")}</strong>
          </div>
        </div>
      ) : null}

      {activeCategoryId && detailCategory ? (
        <section className="category-detail-screen" aria-label={localized(detailCategory, "name", language)}>
          <div className="detail-header app-detail-header">
            <button type="button" className="back-btn" onClick={onCategoryClose} aria-label={copy.backToCategories}>
              <Icon name="back" size={21} />
            </button>
            <strong>{localized(detailCategory, "name", language)}</strong>
          </div>

          <div className="detail-hero-band">
            {detailCategoryImage ? <img src={detailCategoryImage} alt="" /> : null}
            <span>{localized(detailCategory, "name", language)}</span>
          </div>

          <div className="menu-tools detail-menu-tools" aria-label={copy.searchLabel}>
            <label className="menu-search">
              <Icon name="search" size={18} />
              <span>{copy.searchLabel}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
              />
            </label>

            <div className="mood-filter-label">{moodLabel(language)}</div>
            <div className="menu-filters" role="group" aria-label={copy.filterLabel}>
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={filter === item.id ? "is-active" : ""}
                  onClick={() => setFilter(item.id)}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="category-tabs detail-category-tabs" role="tablist" aria-label={copy.menu}>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-button ${detailCategoryId === category.id ? "is-active" : ""}`}
                onClick={() => {
                  onCategoryChange(category.id);
                  onCategoryOpen(category.id);
                }}
              >
                <Icon name={CATEGORY_ICONS[category.id] || "star"} size={16} />
                <span>{localized(category, "name", language)}</span>
                <small>{categoryCounts[category.id] || 0}</small>
              </button>
            ))}
          </div>

          <div className="menu-grid native-list detail-items-list" id="menu-products" aria-live="polite">
            {groupedProducts.map((group) => (
              <div className="detail-product-group" key={group.label}>
                <div className="detail-section-title">{group.label}</div>
                {group.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    copy={copy}
                    isFavorite={favoriteIds.has(product.id)}
                    onView={onProductView}
                    onFavoriteToggle={onFavoriteToggle}
                    onOpenDetail={(item) => {
                      onProductView(item);
                      setSelectedProduct(item);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 ? <p className="empty-menu">{copy.noMenuResults}</p> : null}
        </section>
      ) : null}

      {recommendations.length > 0 ? (
        <div className="recommendations">
          <div className="section-heading compact">
            <p className="eyebrow">{copy.recommendationsEyebrow}</p>
            <h2>{copy.recommendationsTitle}</h2>
          </div>

          <div className="menu-grid native-list compact">
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                copy={copy}
                isFavorite={favoriteIds.has(product.id)}
                onView={onProductView}
                onFavoriteToggle={onFavoriteToggle}
                onOpenDetail={(item) => {
                  onProductView(item);
                  setSelectedProduct(item);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      <ProductDetailSheet
        product={selectedProduct}
        language={language}
        copy={copy}
        isFavorite={selectedProduct ? favoriteIds.has(selectedProduct.id) : false}
        recommendations={selectedRecommendations}
        onClose={() => setSelectedProduct(null)}
        onFavoriteToggle={onFavoriteToggle}
        onJumpToOrder={() => {
          document.getElementById("delivery")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        onSelectProduct={(product) => {
          onProductView(product);
          setSelectedProduct(product);
        }}
      />
    </section>
  );
}
