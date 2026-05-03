import { useEffect, useMemo, useState } from "react";
import {
  getAdminSession,
  loadAdminWorkspace,
  sendAdminMagicLink,
  signInAdminWithPassword,
  signOutAdmin,
  subscribeAdminAuth,
  updateCategory,
  updateProduct,
  updateRestaurantLink,
  updateRestaurantProfile
} from "../services/adminService.js";
import { demoExperience } from "../data/demoExperience.js";
import { hasSupabaseConfig } from "../services/supabaseClient.js";

const PROFILE_FIELDS = ["name", "phone", "whatsapp_number", "google_review_url", "address", "hours", "custom_link"];
const CATEGORY_FIELDS = ["name_tr", "name_es", "name_en", "order_index", "is_active"];
const LINK_FIELDS = ["label", "url", "is_active", "order_index"];
const PRODUCT_FIELDS = ["price", "is_available", "is_signature", "sales_priority", "order_index"];

function adminCopy(language) {
  if (language === "tr") {
    return {
      title: "Admin panel",
      lead: "Gercek menu, link ve gorunurluk ayarlari burada yonetilir.",
      envTitle: "Supabase baglantisi gerekiyor",
      envLead: "Admin paneli kullanmak icin VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanimlanmali.",
      demoTitle: "Demo admin modu",
      demoLead: "Supabase baglanana kadar bu panel demo veriyi duzenlenebilir onizleme olarak acar. Kayitlar bu oturumda kalir.",
      demoSave: "Demo kaydedildi",
      email: "E-posta",
      password: "Sifre",
      signIn: "Giris yap",
      magicLink: "Magic link gonder",
      signingIn: "Giris yapiliyor",
      workspace: "Calisma alani",
      restaurantProfile: "Restoran profili",
      categories: "Kategoriler",
      links: "Linkler",
      products: "Urunler",
      save: "Kaydet",
      saveAll: "Tumunu kaydet",
      saving: "Kaydediliyor",
      saved: "Kaydedildi",
      unsaved: "Degisiklik var",
      signOut: "Cikis yap",
      refresh: "Yenile",
      counts: "Ozet",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      reviewUrl: "Google yorum linki",
      hours: "Saatler",
      address: "Adres",
      customLink: "Ozel link",
      name: "Isletme adi",
      price: "Fiyat",
      available: "Gorunur",
      featured: "One cikan",
      priority: "Oncelik",
      rowOrder: "Sira",
      active: "Aktif",
      statusReady: "Hazir",
      magicLinkSent: "Magic link gonderildi. Mail kutusunu kontrol edin.",
      latestFeedback: "Son yorumlar",
      latestScores: "Son skorlar",
      workspaceError: "Admin verisi yuklenemedi.",
      searchProducts: "Urunlerde ara",
      searchPlaceholder: "Urun adi veya aciklama ara",
      allCategories: "Tum kategoriler",
      allProducts: "Tum urunler",
      onlyVisible: "Sadece gorunenler",
      onlyHidden: "Gizlenenler",
      onlyFeatured: "One cikanlar",
      hidden: "Gizli",
      categoryNameTr: "Kategori TR",
      categoryNameEs: "Kategori ES",
      categoryNameEn: "Kategori EN",
      noProducts: "Bu filtreyle urun yok.",
      noLinks: "Link bulunmadi.",
      noCategories: "Kategori bulunmadi.",
      latest: "Son durum",
      reset: "Taslagi sifirla",
      saveError: "Kayit sirasinda hata olustu.",
      filters: "Filtreler",
      salesPriority: "Satis onceligi",
      productOrder: "Urun sirasi"
    };
  }

  if (language === "en") {
    return {
      title: "Admin panel",
      lead: "Manage the live menu, links and visibility from one workspace.",
      envTitle: "Supabase connection required",
      envLead: "Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use the admin panel.",
      demoTitle: "Demo admin mode",
      demoLead: "Until Supabase is connected, this panel opens the demo data as an editable preview. Saves stay in this session.",
      demoSave: "Demo saved",
      email: "Email",
      password: "Password",
      signIn: "Sign in",
      magicLink: "Send magic link",
      signingIn: "Signing in",
      workspace: "Workspace",
      restaurantProfile: "Restaurant profile",
      categories: "Categories",
      links: "Links",
      products: "Products",
      save: "Save",
      saveAll: "Save all",
      saving: "Saving",
      saved: "Saved",
      unsaved: "Unsaved changes",
      signOut: "Sign out",
      refresh: "Refresh",
      counts: "Overview",
      phone: "Phone",
      whatsapp: "WhatsApp",
      reviewUrl: "Google review link",
      hours: "Hours",
      address: "Address",
      customLink: "Custom link",
      name: "Business name",
      price: "Price",
      available: "Visible",
      featured: "Featured",
      priority: "Priority",
      rowOrder: "Order",
      active: "Active",
      statusReady: "Ready",
      magicLinkSent: "Magic link sent. Check your inbox.",
      latestFeedback: "Latest feedback",
      latestScores: "Latest scores",
      workspaceError: "Could not load the admin workspace.",
      searchProducts: "Search products",
      searchPlaceholder: "Search name or description",
      allCategories: "All categories",
      allProducts: "All products",
      onlyVisible: "Visible only",
      onlyHidden: "Hidden only",
      onlyFeatured: "Featured only",
      hidden: "Hidden",
      categoryNameTr: "Category TR",
      categoryNameEs: "Category ES",
      categoryNameEn: "Category EN",
      noProducts: "No products match this filter.",
      noLinks: "No links found.",
      noCategories: "No categories found.",
      latest: "Latest",
      reset: "Reset draft",
      saveError: "Something went wrong while saving.",
      filters: "Filters",
      salesPriority: "Sales priority",
      productOrder: "Product order"
    };
  }

  return {
    title: "Panel admin",
    lead: "Gestiona el menu real, los enlaces y la visibilidad desde un solo lugar.",
    envTitle: "Hace falta conectar Supabase",
    envLead: "Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para abrir el panel admin.",
    demoTitle: "Modo admin demo",
    demoLead: "Hasta conectar Supabase, este panel abre los datos demo como una vista editable. Los cambios quedan en esta sesion.",
    demoSave: "Demo guardado",
    email: "Correo",
    password: "Contrasena",
    signIn: "Entrar",
    magicLink: "Enviar magic link",
    signingIn: "Entrando",
    workspace: "Espacio de trabajo",
    restaurantProfile: "Perfil del restaurante",
    categories: "Categorias",
    links: "Enlaces",
    products: "Productos",
    save: "Guardar",
    saveAll: "Guardar todo",
    saving: "Guardando",
    saved: "Guardado",
    unsaved: "Hay cambios",
    signOut: "Salir",
    refresh: "Actualizar",
    counts: "Resumen",
    phone: "Telefono",
    whatsapp: "WhatsApp",
    reviewUrl: "Link de Google reviews",
    hours: "Horario",
    address: "Direccion",
    customLink: "Enlace propio",
    name: "Nombre del negocio",
    price: "Precio",
    available: "Visible",
    featured: "Destacado",
    priority: "Prioridad",
    rowOrder: "Orden",
    active: "Activo",
    statusReady: "Listo",
    magicLinkSent: "Magic link enviado. Revisa tu correo.",
    latestFeedback: "Ultimos comentarios",
    latestScores: "Ultimas puntuaciones",
    workspaceError: "No se pudo cargar el espacio admin.",
    searchProducts: "Buscar productos",
    searchPlaceholder: "Busca por nombre o descripcion",
    allCategories: "Todas las categorias",
    allProducts: "Todos los productos",
    onlyVisible: "Solo visibles",
    onlyHidden: "Solo ocultos",
    onlyFeatured: "Solo destacados",
    hidden: "Oculto",
    categoryNameTr: "Categoria TR",
    categoryNameEs: "Categoria ES",
    categoryNameEn: "Categoria EN",
    noProducts: "No hay productos con este filtro.",
    noLinks: "No se encontraron enlaces.",
    noCategories: "No se encontraron categorias.",
    latest: "Ultimos",
    reset: "Resetear borrador",
    saveError: "Hubo un error al guardar.",
    filters: "Filtros",
    salesPriority: "Prioridad de venta",
    productOrder: "Orden del producto"
  };
}

function normalizeRowState(rows, fields) {
  return rows.reduce((accumulator, row) => {
    accumulator[row.id] = fields.reduce((fieldMap, field) => {
      fieldMap[field] = row[field];
      return fieldMap;
    }, {});
    return accumulator;
  }, {});
}

function normalizeProfileDraft(restaurant) {
  return {
    name: restaurant.name || "",
    phone: restaurant.phone || "",
    whatsapp_number: restaurant.whatsapp_number || "",
    google_review_url: restaurant.google_review_url || "",
    address: restaurant.address || "",
    hours: restaurant.hours || "",
    custom_link: restaurant.custom_link || ""
  };
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function patchesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function buildPatch(original, draft, fields, coerce = {}) {
  const patch = {};

  fields.forEach((field) => {
    const transform = coerce[field] || ((value) => value);
    const nextValue = transform(draft[field]);
    const currentValue = transform(original[field]);

    if (!patchesEqual(nextValue, currentValue)) {
      patch[field] = nextValue;
    }
  });

  return patch;
}

function buildLookup(rows) {
  return rows.reduce((accumulator, row) => {
    accumulator[row.id] = row;
    return accumulator;
  }, {});
}

function statusTone(status) {
  if (status === "saved") {
    return "success";
  }

  if (status === "error") {
    return "error";
  }

  if (status === "saving") {
    return "working";
  }

  if (status === "dirty") {
    return "dirty";
  }

  return "idle";
}

function saveLabel(status, copy) {
  if (status === "saving") {
    return copy.saving;
  }

  if (status === "saved") {
    return copy.saved;
  }

  if (status === "dirty") {
    return copy.unsaved;
  }

  if (status === "error") {
    return copy.saveError;
  }

  return copy.statusReady;
}

function groupedCategoryOptions(categories) {
  return categories.map((category) => ({
    id: category.id,
    label: category.name_es || category.name_en || category.name_tr
  }));
}

function localizedColumns(value = {}) {
  return {
    name_tr: value.tr || "",
    name_es: value.es || "",
    name_en: value.en || ""
  };
}

function descriptionColumns(value = {}) {
  return {
    description_tr: value.tr || "",
    description_es: value.es || "",
    description_en: value.en || ""
  };
}

function createDemoAdminWorkspace() {
  return {
    restaurant: { ...demoExperience.restaurant },
    categories: demoExperience.categories.map((category) => ({
      ...category,
      ...localizedColumns(category.name),
      is_active: category.is_active !== false
    })),
    products: demoExperience.products.map((product) => ({
      ...product,
      ...localizedColumns(product.name),
      ...descriptionColumns(product.description),
      is_available: product.is_available !== false
    })),
    links: (demoExperience.links || []).map((link) => ({
      ...link,
      is_active: link.is_active !== false
    })),
    feedback: {
      total: 3,
      latest: [
        { id: "demo-feedback-1", star_rating: 5, platform: "google" },
        { id: "demo-feedback-2", star_rating: 4, platform: "internal" },
        { id: "demo-feedback-3", star_rating: 5, platform: "google" }
      ]
    },
    leaderboard: {
      total: demoExperience.leaderboard?.length || 0,
      latest: demoExperience.leaderboard || []
    }
  };
}

export default function AdminPanel({ restaurantSlug, language = "es", brandRestaurant = null }) {
  const copy = adminCopy(language);
  const isDemoAdmin = !hasSupabaseConfig;
  const [session, setSession] = useState(null);
  const hasAdminAccess = Boolean(session) || isDemoAdmin;
  const [workspaceStatus, setWorkspaceStatus] = useState(hasSupabaseConfig ? "auth" : "missing-env");
  const [workspace, setWorkspace] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [profileDraft, setProfileDraft] = useState(null);
  const [categoryDrafts, setCategoryDrafts] = useState({});
  const [productDrafts, setProductDrafts] = useState({});
  const [linkDrafts, setLinkDrafts] = useState({});
  const [saveState, setSaveState] = useState({});
  const [productQuery, setProductQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productVisibilityFilter, setProductVisibilityFilter] = useState("all");

  const headerRestaurant = workspace?.restaurant || brandRestaurant;

  const categoryLookup = useMemo(() => buildLookup(workspace?.categories || []), [workspace?.categories]);
  const productLookup = useMemo(() => buildLookup(workspace?.products || []), [workspace?.products]);
  const linkLookup = useMemo(() => buildLookup(workspace?.links || []), [workspace?.links]);

  const productSummary = useMemo(() => {
    if (!workspace) {
      return { total: 0, visible: 0, featured: 0, categories: 0 };
    }

    return {
      total: workspace.products.length,
      visible: workspace.products.filter((item) => item.is_available).length,
      featured: workspace.products.filter((item) => item.is_signature).length,
      categories: workspace.categories.filter((item) => item.is_active).length
    };
  }, [workspace]);

  const profileDirty = useMemo(() => {
    if (!workspace || !profileDraft) {
      return false;
    }

    return Object.keys(buildPatch(workspace.restaurant, profileDraft, PROFILE_FIELDS)).length > 0;
  }, [profileDraft, workspace]);

  const categoryDirtyIds = useMemo(() => {
    if (!workspace) {
      return [];
    }

    return workspace.categories
      .filter((category) =>
        Object.keys(
          buildPatch(category, categoryDrafts[category.id] || {}, CATEGORY_FIELDS, {
            order_index: numberValue,
            is_active: Boolean
          })
        ).length
      )
      .map((category) => category.id);
  }, [categoryDrafts, workspace]);

  const linkDirtyIds = useMemo(() => {
    if (!workspace) {
      return [];
    }

    return workspace.links
      .filter((link) =>
        Object.keys(
          buildPatch(link, linkDrafts[link.id] || {}, LINK_FIELDS, {
            is_active: Boolean,
            order_index: numberValue
          })
        ).length
      )
      .map((link) => link.id);
  }, [linkDrafts, workspace]);

  const productDirtyIds = useMemo(() => {
    if (!workspace) {
      return [];
    }

    return workspace.products
      .filter((product) =>
        Object.keys(
          buildPatch(product, productDrafts[product.id] || {}, PRODUCT_FIELDS, {
            price: numberValue,
            sales_priority: numberValue,
            order_index: numberValue,
            is_available: Boolean,
            is_signature: Boolean
          })
        ).length
      )
      .map((product) => product.id);
  }, [productDrafts, workspace]);

  const filteredProducts = useMemo(() => {
    if (!workspace) {
      return [];
    }

    const query = productQuery.trim().toLowerCase();

    return workspace.products.filter((product) => {
      const matchesCategory = productCategoryFilter === "all" || product.category_id === productCategoryFilter;
      const matchesVisibility =
        productVisibilityFilter === "all" ||
        (productVisibilityFilter === "visible" && Boolean(productDrafts[product.id]?.is_available)) ||
        (productVisibilityFilter === "hidden" && !Boolean(productDrafts[product.id]?.is_available)) ||
        (productVisibilityFilter === "featured" && Boolean(productDrafts[product.id]?.is_signature));

      const haystack = [
        product.name_es,
        product.name_en,
        product.name_tr,
        product.description_es,
        product.description_en,
        product.description_tr
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || haystack.includes(query);

      return matchesCategory && matchesVisibility && matchesQuery;
    });
  }, [productCategoryFilter, productDrafts, productQuery, productVisibilityFilter, workspace]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      hydrateWorkspace(createDemoAdminWorkspace());
      setWorkspaceStatus("ready");
      return undefined;
    }

    let mounted = true;

    getAdminSession()
      .then((nextSession) => {
        if (mounted) {
          setSession(nextSession);
          setWorkspaceStatus(nextSession ? "loading" : "auth");
        }
      })
      .catch(() => {
        if (mounted) {
          setWorkspaceStatus("auth");
        }
      });

    const unsubscribe = subscribeAdminAuth((nextSession) => {
      setSession(nextSession);
      setWorkspaceStatus(nextSession ? "loading" : "auth");
      if (!nextSession) {
        setWorkspace(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [restaurantSlug]);

  useEffect(() => {
    if (!session || !hasSupabaseConfig) {
      return;
    }

    refreshWorkspace();
  }, [restaurantSlug, session]);

  function hydrateWorkspace(nextWorkspace) {
    setWorkspace(nextWorkspace);
    setProfileDraft(normalizeProfileDraft(nextWorkspace.restaurant));
    setCategoryDrafts(normalizeRowState(nextWorkspace.categories, CATEGORY_FIELDS));
    setProductDrafts(normalizeRowState(nextWorkspace.products, PRODUCT_FIELDS));
    setLinkDrafts(normalizeRowState(nextWorkspace.links, LINK_FIELDS));
  }

  async function refreshWorkspace(showLoading = true) {
    if (showLoading) {
      setWorkspaceStatus("loading");
    }

    try {
      const nextWorkspace = await loadAdminWorkspace(restaurantSlug);
      hydrateWorkspace(nextWorkspace);
      setWorkspaceStatus("ready");
      setAuthError("");
    } catch (error) {
      setAuthError(error.message || copy.workspaceError);
      setWorkspaceStatus("error");
    }
  }

  function resetDrafts() {
    if (!workspace) {
      return;
    }

    hydrateWorkspace(workspace);
    setSaveState({});
  }

  function setRowStatus(key, status) {
    setSaveState((current) => ({ ...current, [key]: status }));
  }

  async function handlePasswordSignIn(event) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");

    try {
      await signInAdminWithPassword(authForm);
    } catch (error) {
      setAuthError(error.message || "Login failed");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleMagicLink() {
    if (!authForm.email) {
      setAuthError(copy.email);
      return;
    }

    setAuthBusy(true);
    setAuthError("");

    try {
      await sendAdminMagicLink({ email: authForm.email, restaurantSlug });
      setAuthError(copy.magicLinkSent);
    } catch (error) {
      setAuthError(error.message || "Magic link failed");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleProfileSave() {
    if (!workspace || !profileDraft) {
      return;
    }

    const patch = buildPatch(workspace.restaurant, profileDraft, PROFILE_FIELDS);
    if (!Object.keys(patch).length) {
      setRowStatus("profile", "saved");
      return;
    }

    setRowStatus("profile", "saving");

    if (isDemoAdmin) {
      const restaurant = { ...workspace.restaurant, ...patch };
      setWorkspace((current) => ({ ...current, restaurant }));
      setProfileDraft(normalizeProfileDraft(restaurant));
      setRowStatus("profile", "saved");
      return;
    }

    try {
      const restaurant = await updateRestaurantProfile(workspace.restaurant.id, patch);
      setWorkspace((current) => ({ ...current, restaurant }));
      setProfileDraft(normalizeProfileDraft(restaurant));
      setRowStatus("profile", "saved");
    } catch {
      setRowStatus("profile", "error");
    }
  }

  async function handleCategorySave(categoryId) {
    const category = categoryLookup[categoryId];
    const draft = categoryDrafts[categoryId];

    if (!category || !draft) {
      return;
    }

    const patch = buildPatch(category, draft, CATEGORY_FIELDS, {
      order_index: numberValue,
      is_active: Boolean
    });

    if (!Object.keys(patch).length) {
      setRowStatus(categoryId, "saved");
      return;
    }

    setRowStatus(categoryId, "saving");

    if (isDemoAdmin) {
      const updated = { ...category, ...patch };
      setWorkspace((current) => ({
        ...current,
        categories: current.categories
          .map((item) => (item.id === categoryId ? updated : item))
          .sort((left, right) => left.order_index - right.order_index)
      }));
      setCategoryDrafts((current) => ({
        ...current,
        [categoryId]: CATEGORY_FIELDS.reduce((accumulator, field) => {
          accumulator[field] = updated[field];
          return accumulator;
        }, {})
      }));
      setRowStatus(categoryId, "saved");
      return;
    }

    try {
      const updated = await updateCategory(categoryId, patch);
      setWorkspace((current) => ({
        ...current,
        categories: current.categories
          .map((item) => (item.id === categoryId ? { ...item, ...updated } : item))
          .sort((left, right) => left.order_index - right.order_index)
      }));
      setCategoryDrafts((current) => ({
        ...current,
        [categoryId]: CATEGORY_FIELDS.reduce((accumulator, field) => {
          accumulator[field] = updated[field];
          return accumulator;
        }, {})
      }));
      setRowStatus(categoryId, "saved");
    } catch {
      setRowStatus(categoryId, "error");
    }
  }

  async function handleLinkSave(linkId) {
    const link = linkLookup[linkId];
    const draft = linkDrafts[linkId];

    if (!link || !draft) {
      return;
    }

    const patch = buildPatch(link, draft, LINK_FIELDS, {
      is_active: Boolean,
      order_index: numberValue
    });

    if (!Object.keys(patch).length) {
      setRowStatus(linkId, "saved");
      return;
    }

    setRowStatus(linkId, "saving");

    if (isDemoAdmin) {
      const updated = { ...link, ...patch };
      setWorkspace((current) => ({
        ...current,
        links: current.links
          .map((item) => (item.id === linkId ? updated : item))
          .sort((left, right) => left.order_index - right.order_index)
      }));
      setLinkDrafts((current) => ({
        ...current,
        [linkId]: LINK_FIELDS.reduce((accumulator, field) => {
          accumulator[field] = updated[field];
          return accumulator;
        }, {})
      }));
      setRowStatus(linkId, "saved");
      return;
    }

    try {
      const updated = await updateRestaurantLink(linkId, patch);
      setWorkspace((current) => ({
        ...current,
        links: current.links
          .map((item) => (item.id === linkId ? { ...item, ...updated } : item))
          .sort((left, right) => left.order_index - right.order_index)
      }));
      setLinkDrafts((current) => ({
        ...current,
        [linkId]: LINK_FIELDS.reduce((accumulator, field) => {
          accumulator[field] = updated[field];
          return accumulator;
        }, {})
      }));
      setRowStatus(linkId, "saved");
    } catch {
      setRowStatus(linkId, "error");
    }
  }

  async function handleProductSave(productId) {
    const product = productLookup[productId];
    const draft = productDrafts[productId];

    if (!product || !draft) {
      return;
    }

    const patch = buildPatch(product, draft, PRODUCT_FIELDS, {
      price: numberValue,
      sales_priority: numberValue,
      order_index: numberValue,
      is_available: Boolean,
      is_signature: Boolean
    });

    if (!Object.keys(patch).length) {
      setRowStatus(productId, "saved");
      return;
    }

    setRowStatus(productId, "saving");

    if (isDemoAdmin) {
      const updated = { ...product, ...patch };
      setWorkspace((current) => ({
        ...current,
        products: current.products
          .map((item) => (item.id === productId ? updated : item))
          .sort((left, right) => left.order_index - right.order_index)
      }));
      setProductDrafts((current) => ({
        ...current,
        [productId]: PRODUCT_FIELDS.reduce((accumulator, field) => {
          accumulator[field] = updated[field];
          return accumulator;
        }, {})
      }));
      setRowStatus(productId, "saved");
      return;
    }

    try {
      const updated = await updateProduct(productId, patch);
      setWorkspace((current) => ({
        ...current,
        products: current.products
          .map((item) => (item.id === productId ? { ...item, ...updated } : item))
          .sort((left, right) => left.order_index - right.order_index)
      }));
      setProductDrafts((current) => ({
        ...current,
        [productId]: PRODUCT_FIELDS.reduce((accumulator, field) => {
          accumulator[field] = updated[field];
          return accumulator;
        }, {})
      }));
      setRowStatus(productId, "saved");
    } catch {
      setRowStatus(productId, "error");
    }
  }

  async function handleSaveAllCategories() {
    for (const categoryId of categoryDirtyIds) {
      // eslint-disable-next-line no-await-in-loop
      await handleCategorySave(categoryId);
    }
  }

  async function handleSaveAllLinks() {
    for (const linkId of linkDirtyIds) {
      // eslint-disable-next-line no-await-in-loop
      await handleLinkSave(linkId);
    }
  }

  async function handleSaveAllProducts() {
    for (const productId of productDirtyIds) {
      // eslint-disable-next-line no-await-in-loop
      await handleProductSave(productId);
    }
  }

  function renderStatus(statusKey, isDirty) {
    const currentStatus = saveState[statusKey];
    const status =
      currentStatus === "saving" || currentStatus === "error" ? currentStatus : isDirty ? "dirty" : currentStatus || "idle";
    return <span className={`admin-status admin-status-${statusTone(status)}`}>{saveLabel(status, copy)}</span>;
  }

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div>
          <small>{copy.workspace}</small>
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>

        {headerRestaurant ? (
          <div className="admin-hero-brand">
            {headerRestaurant.logo_image_url ? <img src={headerRestaurant.logo_image_url} alt="" /> : null}
            <strong>{headerRestaurant.name}</strong>
            <span>{restaurantSlug}</span>
          </div>
        ) : null}
      </section>

      {isDemoAdmin ? (
        <section className="admin-card admin-demo-notice">
          <h2>{copy.demoTitle}</h2>
          <p>{copy.demoLead}</p>
          <code>VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY</code>
        </section>
      ) : null}

      {hasSupabaseConfig && !session ? (
        <section className="admin-card admin-auth-card">
          <form onSubmit={handlePasswordSignIn}>
            <label>
              <span>{copy.email}</span>
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
              />
            </label>
            <label>
              <span>{copy.password}</span>
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="current-password"
              />
            </label>

            <div className="admin-auth-actions">
              <button type="submit" className="primary-button" disabled={authBusy}>
                {authBusy ? copy.signingIn : copy.signIn}
              </button>
              <button type="button" className="ghost-button" onClick={handleMagicLink} disabled={authBusy}>
                {copy.magicLink}
              </button>
            </div>

            {authError ? <p className="admin-note">{authError}</p> : null}
          </form>
        </section>
      ) : null}

      {hasAdminAccess ? (
        <>
          <section className="admin-toolbar">
            <div className="admin-summary-grid">
              <article className="admin-mini-card">
                <small>{copy.products}</small>
                <strong>{productSummary.total}</strong>
                <span>{copy.allProducts}</span>
              </article>
              <article className="admin-mini-card">
                <small>{copy.available}</small>
                <strong>{productSummary.visible}</strong>
                <span>{copy.products}</span>
              </article>
              <article className="admin-mini-card">
                <small>{copy.featured}</small>
                <strong>{productSummary.featured}</strong>
                <span>{copy.products}</span>
              </article>
              <article className="admin-mini-card">
                <small>{copy.categories}</small>
                <strong>{productSummary.categories}</strong>
                <span>{copy.active}</span>
              </article>
            </div>

            <div className="admin-toolbar-actions">
              <button type="button" className="ghost-button" onClick={() => (isDemoAdmin ? hydrateWorkspace(createDemoAdminWorkspace()) : refreshWorkspace())}>
                {copy.refresh}
              </button>
              <button type="button" className="ghost-button" onClick={resetDrafts}>
                {copy.reset}
              </button>
              {!isDemoAdmin ? (
                <button type="button" className="ghost-button" onClick={signOutAdmin}>
                  {copy.signOut}
                </button>
              ) : null}
            </div>
          </section>

          {workspaceStatus === "loading" ? <section className="admin-card">Loading...</section> : null}
          {workspaceStatus === "error" ? (
            <section className="admin-card">
              <p>{authError || copy.workspaceError}</p>
            </section>
          ) : null}

          {workspace ? (
            <div className="admin-grid">
              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <h2>{copy.restaurantProfile}</h2>
                    {renderStatus("profile", profileDirty)}
                  </div>
                  <button type="button" className="primary-button" onClick={handleProfileSave}>
                    {saveState.profile === "saving" ? copy.saving : copy.save}
                  </button>
                </div>

                <div className="admin-form-grid">
                  <label>
                    <span>{copy.name}</span>
                    <input
                      value={profileDraft?.name || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), name: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span>{copy.phone}</span>
                    <input
                      value={profileDraft?.phone || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), phone: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span>{copy.whatsapp}</span>
                    <input
                      value={profileDraft?.whatsapp_number || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), whatsapp_number: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span>{copy.customLink}</span>
                    <input
                      value={profileDraft?.custom_link || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), custom_link: event.target.value }))
                      }
                    />
                  </label>
                  <label className="is-wide">
                    <span>{copy.reviewUrl}</span>
                    <input
                      value={profileDraft?.google_review_url || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), google_review_url: event.target.value }))
                      }
                    />
                  </label>
                  <label className="is-wide">
                    <span>{copy.address}</span>
                    <input
                      value={profileDraft?.address || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), address: event.target.value }))
                      }
                    />
                  </label>
                  <label className="is-wide">
                    <span>{copy.hours}</span>
                    <input
                      value={profileDraft?.hours || ""}
                      onChange={(event) =>
                        setProfileDraft((current) => ({ ...(current || {}), hours: event.target.value }))
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <h2>{copy.categories}</h2>
                    {renderStatus("categories-all", categoryDirtyIds.length > 0)}
                  </div>
                  <button type="button" className="primary-button" onClick={handleSaveAllCategories}>
                    {copy.saveAll}
                  </button>
                </div>

                <div className="admin-list">
                  {workspace.categories.map((category) => {
                    const draft = categoryDrafts[category.id] || {};
                    const dirty =
                      Object.keys(
                        buildPatch(category, draft, CATEGORY_FIELDS, {
                          order_index: numberValue,
                          is_active: Boolean
                        })
                      ).length > 0;

                    return (
                      <article key={category.id} className="admin-row admin-row-category">
                        <div className="admin-row-copy">
                          <strong>{category.name_es || category.name_en || category.name_tr}</strong>
                          {renderStatus(category.id, dirty)}
                        </div>

                        <label className="admin-inline-field">
                          <span>{copy.categoryNameEs}</span>
                          <input
                            value={draft.name_es || ""}
                            onChange={(event) =>
                              setCategoryDrafts((current) => ({
                                ...current,
                                [category.id]: { ...(current[category.id] || {}), name_es: event.target.value }
                              }))
                            }
                          />
                        </label>

                        <label className="admin-inline-field">
                          <span>{copy.categoryNameTr}</span>
                          <input
                            value={draft.name_tr || ""}
                            onChange={(event) =>
                              setCategoryDrafts((current) => ({
                                ...current,
                                [category.id]: { ...(current[category.id] || {}), name_tr: event.target.value }
                              }))
                            }
                          />
                        </label>

                        <label className="admin-inline-field">
                          <span>{copy.rowOrder}</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={draft.order_index ?? 0}
                            onChange={(event) =>
                              setCategoryDrafts((current) => ({
                                ...current,
                                [category.id]: { ...(current[category.id] || {}), order_index: event.target.value }
                              }))
                            }
                          />
                        </label>

                        <label className="admin-inline-check">
                          <input
                            type="checkbox"
                            checked={Boolean(draft.is_active)}
                            onChange={(event) =>
                              setCategoryDrafts((current) => ({
                                ...current,
                                [category.id]: { ...(current[category.id] || {}), is_active: event.target.checked }
                              }))
                            }
                          />
                          <span>{copy.active}</span>
                        </label>

                        <button type="button" className="ghost-button" onClick={() => handleCategorySave(category.id)}>
                          {saveState[category.id] === "saving" ? copy.saving : copy.save}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <h2>{copy.links}</h2>
                    {renderStatus("links-all", linkDirtyIds.length > 0)}
                  </div>
                  <button type="button" className="primary-button" onClick={handleSaveAllLinks}>
                    {copy.saveAll}
                  </button>
                </div>

                <div className="admin-list">
                  {workspace.links.map((link) => {
                    const draft = linkDrafts[link.id] || {};
                    const dirty =
                      Object.keys(
                        buildPatch(link, draft, LINK_FIELDS, {
                          is_active: Boolean,
                          order_index: numberValue
                        })
                      ).length > 0;

                    return (
                      <article key={link.id} className="admin-row admin-row-link">
                        <div className="admin-row-copy">
                          <strong>{link.kind}</strong>
                          {renderStatus(link.id, dirty)}
                        </div>

                        <label className="admin-inline-field">
                          <span>Label</span>
                          <input
                            value={draft.label || ""}
                            onChange={(event) =>
                              setLinkDrafts((current) => ({
                                ...current,
                                [link.id]: { ...(current[link.id] || {}), label: event.target.value }
                              }))
                            }
                          />
                        </label>

                        <label className="admin-inline-field admin-inline-field-wide">
                          <span>URL</span>
                          <input
                            value={draft.url || ""}
                            onChange={(event) =>
                              setLinkDrafts((current) => ({
                                ...current,
                                [link.id]: { ...(current[link.id] || {}), url: event.target.value }
                              }))
                            }
                          />
                        </label>

                        <label className="admin-inline-field">
                          <span>{copy.rowOrder}</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={draft.order_index ?? 0}
                            onChange={(event) =>
                              setLinkDrafts((current) => ({
                                ...current,
                                [link.id]: { ...(current[link.id] || {}), order_index: event.target.value }
                              }))
                            }
                          />
                        </label>

                        <label className="admin-inline-check">
                          <input
                            type="checkbox"
                            checked={Boolean(draft.is_active)}
                            onChange={(event) =>
                              setLinkDrafts((current) => ({
                                ...current,
                                [link.id]: { ...(current[link.id] || {}), is_active: event.target.checked }
                              }))
                            }
                          />
                          <span>{copy.active}</span>
                        </label>

                        <button type="button" className="ghost-button" onClick={() => handleLinkSave(link.id)}>
                          {saveState[link.id] === "saving" ? copy.saving : copy.save}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="admin-card admin-card-wide">
                <div className="admin-card-head">
                  <div>
                    <h2>{copy.products}</h2>
                    {renderStatus("products-all", productDirtyIds.length > 0)}
                  </div>
                  <button type="button" className="primary-button" onClick={handleSaveAllProducts}>
                    {copy.saveAll}
                  </button>
                </div>

                <div className="admin-filter-panel">
                  <label className="admin-inline-field admin-inline-field-grow">
                    <span>{copy.searchProducts}</span>
                    <input
                      value={productQuery}
                      placeholder={copy.searchPlaceholder}
                      onChange={(event) => setProductQuery(event.target.value)}
                    />
                  </label>

                  <label className="admin-inline-field">
                    <span>{copy.categories}</span>
                    <select value={productCategoryFilter} onChange={(event) => setProductCategoryFilter(event.target.value)}>
                      <option value="all">{copy.allCategories}</option>
                      {groupedCategoryOptions(workspace.categories).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="admin-chip-row">
                    <button
                      type="button"
                      className={`admin-chip ${productVisibilityFilter === "all" ? "is-active" : ""}`}
                      onClick={() => setProductVisibilityFilter("all")}
                    >
                      {copy.allProducts}
                    </button>
                    <button
                      type="button"
                      className={`admin-chip ${productVisibilityFilter === "visible" ? "is-active" : ""}`}
                      onClick={() => setProductVisibilityFilter("visible")}
                    >
                      {copy.onlyVisible}
                    </button>
                    <button
                      type="button"
                      className={`admin-chip ${productVisibilityFilter === "hidden" ? "is-active" : ""}`}
                      onClick={() => setProductVisibilityFilter("hidden")}
                    >
                      {copy.onlyHidden}
                    </button>
                    <button
                      type="button"
                      className={`admin-chip ${productVisibilityFilter === "featured" ? "is-active" : ""}`}
                      onClick={() => setProductVisibilityFilter("featured")}
                    >
                      {copy.onlyFeatured}
                    </button>
                  </div>
                </div>

                <div className="admin-list">
                  {filteredProducts.length ? (
                    filteredProducts.map((product) => {
                      const draft = productDrafts[product.id] || {};
                      const dirty =
                        Object.keys(
                          buildPatch(product, draft, PRODUCT_FIELDS, {
                            price: numberValue,
                            sales_priority: numberValue,
                            order_index: numberValue,
                            is_available: Boolean,
                            is_signature: Boolean
                          })
                        ).length > 0;
                      const category = categoryLookup[product.category_id];

                      return (
                        <article key={product.id} className="admin-row product-row product-row-rich">
                          <div className="admin-row-copy">
                            <strong>{product.name_es || product.name_en || product.name_tr}</strong>
                            <span>{category?.name_es || category?.name_en || category?.name_tr}</span>
                            {renderStatus(product.id, dirty)}
                          </div>

                          <label className="admin-inline-field">
                            <span>{copy.price}</span>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={draft.price ?? product.price}
                              onChange={(event) =>
                                setProductDrafts((current) => ({
                                  ...current,
                                  [product.id]: { ...(current[product.id] || {}), price: event.target.value }
                                }))
                              }
                            />
                          </label>

                          <label className="admin-inline-field">
                            <span>{copy.salesPriority}</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={draft.sales_priority ?? product.sales_priority}
                              onChange={(event) =>
                                setProductDrafts((current) => ({
                                  ...current,
                                  [product.id]: { ...(current[product.id] || {}), sales_priority: event.target.value }
                                }))
                              }
                            />
                          </label>

                          <label className="admin-inline-field">
                            <span>{copy.productOrder}</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={draft.order_index ?? product.order_index}
                              onChange={(event) =>
                                setProductDrafts((current) => ({
                                  ...current,
                                  [product.id]: { ...(current[product.id] || {}), order_index: event.target.value }
                                }))
                              }
                            />
                          </label>

                          <label className="admin-inline-check">
                            <input
                              type="checkbox"
                              checked={Boolean(draft.is_available)}
                              onChange={(event) =>
                                setProductDrafts((current) => ({
                                  ...current,
                                  [product.id]: { ...(current[product.id] || {}), is_available: event.target.checked }
                                }))
                              }
                            />
                            <span>{copy.available}</span>
                          </label>

                          <label className="admin-inline-check">
                            <input
                              type="checkbox"
                              checked={Boolean(draft.is_signature)}
                              onChange={(event) =>
                                setProductDrafts((current) => ({
                                  ...current,
                                  [product.id]: { ...(current[product.id] || {}), is_signature: event.target.checked }
                                }))
                              }
                            />
                            <span>{copy.featured}</span>
                          </label>

                          <button type="button" className="ghost-button" onClick={() => handleProductSave(product.id)}>
                            {saveState[product.id] === "saving" ? copy.saving : copy.save}
                          </button>
                        </article>
                      );
                    })
                  ) : (
                    <article className="admin-empty">{copy.noProducts}</article>
                  )}
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <h2>{copy.latestFeedback}</h2>
                    <span className="admin-note">{copy.latest}</span>
                  </div>
                </div>
                <div className="admin-list compact-list">
                  {workspace.feedback.latest.map((item) => (
                    <article key={item.id} className="admin-row-simple">
                      <strong>{item.star_rating} / 5</strong>
                      <span>{item.platform}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <h2>{copy.latestScores}</h2>
                    <span className="admin-note">{copy.latest}</span>
                  </div>
                </div>
                <div className="admin-list compact-list">
                  {workspace.leaderboard.latest.map((item) => (
                    <article key={item.id} className="admin-row-simple">
                      <strong>{item.player_name}</strong>
                      <span>{item.score}</span>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
