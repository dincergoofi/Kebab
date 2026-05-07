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

const PROFILE_FIELDS = ["name", "phone", "whatsapp_number", "google_review_url", "address", "hours", "custom_link", "tagline_tr", "tagline_es", "tagline_en"];
const CATEGORY_FIELDS = ["name_tr", "name_es", "name_en", "order_index", "is_active"];
const LINK_FIELDS = ["label", "url", "is_active", "order_index"];
const PRODUCT_FIELDS = ["price", "is_available", "is_signature", "sales_priority", "order_index"];

function detectLanguage() {
  const lang = (navigator.language || "es").toLowerCase();
  if (lang.startsWith("tr")) return "tr";
  if (lang.startsWith("en")) return "en";
  return "es";
}

function adminCopy(language) {
  if (language === "tr") {
    return {
      title: "Yönetici Paneli", lead: "Menü, linkler ve görünürlük burada yönetilir.",
      envTitle: "Supabase bağlantısı gerekiyor", envLead: "VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlanmalı.",
      demoTitle: "Demo yönetici modu", demoLead: "Supabase bağlanana kadar demo veri kullanılıyor. Değişiklikler bu oturumda kalır.",
      demoSave: "Demo kaydedildi", email: "E-posta", password: "Şifre", signIn: "Giriş yap",
      magicLink: "Magic link gönder", signingIn: "Giriş yapılıyor", workspace: "Çalışma Alanı",
      restaurantProfile: "Restoran Profili", categories: "Kategoriler", links: "Linkler", products: "Ürünler",
      save: "Kaydet", saveAll: "Tümünü kaydet", saving: "Kaydediliyor...", saved: "✓ Kaydedildi",
      unsaved: "● Değişiklik var", signOut: "Çıkış", refresh: "Yenile", counts: "Özet",
      phone: "Telefon", whatsapp: "WhatsApp", reviewUrl: "Google yorum linki", hours: "Çalışma saatleri",
      address: "Adres", customLink: "Özel link", name: "İşletme adı", price: "Fiyat (€)",
      available: "Görünür", featured: "Öne çıkan", priority: "Öncelik", rowOrder: "Sıra",
      active: "Aktif", statusReady: "Hazır", magicLinkSent: "Magic link gönderildi. E-postanı kontrol et.",
      latestFeedback: "Son yorumlar", latestScores: "Son skorlar", workspaceError: "Admin verisi yüklenemedi.",
      searchProducts: "Ürün ara...", allCategories: "Tüm kategoriler", allProducts: "Tümü",
      onlyVisible: "Görünür", onlyHidden: "Gizli", onlyFeatured: "Öne çıkan", hidden: "Gizli",
      categoryNameTr: "TR", categoryNameEs: "ES", categoryNameEn: "EN",
      noProducts: "Bu filtreyle ürün yok.", noLinks: "Link bulunamadı.", noCategories: "Kategori bulunamadı.",
      latest: "Son durum", reset: "Sıfırla", saveError: "Kayıt hatası.", filters: "Filtreler",
      salesPriority: "Satış önceliği", productOrder: "Sıra no", totalProducts: "Toplam ürün",
      visibleProducts: "Görünür", featuredProducts: "Öne çıkan", activeCategories: "Kategori",
      taglineTr: "Slogan TR", taglineEs: "Slogan ES", taglineEn: "Slogan EN",
      socialLinks: "Sosyal linkler", socialLinksHelp: "Her satir icin Label | URL formatini kullan."
    };
  }
  if (language === "en") {
    return {
      title: "Admin Panel", lead: "Manage the live menu, links and visibility.",
      envTitle: "Supabase connection required", envLead: "Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      demoTitle: "Demo admin mode", demoLead: "Supabase not connected. Changes stay in this session.",
      demoSave: "Demo saved", email: "Email", password: "Password", signIn: "Sign in",
      magicLink: "Send magic link", signingIn: "Signing in...", workspace: "Workspace",
      restaurantProfile: "Restaurant Profile", categories: "Categories", links: "Links", products: "Products",
      save: "Save", saveAll: "Save all", saving: "Saving...", saved: "✓ Saved",
      unsaved: "● Unsaved", signOut: "Sign out", refresh: "Refresh", counts: "Overview",
      phone: "Phone", whatsapp: "WhatsApp", reviewUrl: "Google review link", hours: "Hours",
      address: "Address", customLink: "Custom link", name: "Business name", price: "Price (€)",
      available: "Visible", featured: "Featured", priority: "Priority", rowOrder: "Order",
      active: "Active", statusReady: "Ready", magicLinkSent: "Magic link sent. Check your inbox.",
      latestFeedback: "Latest feedback", latestScores: "Latest scores", workspaceError: "Could not load workspace.",
      searchProducts: "Search products...", allCategories: "All categories", allProducts: "All",
      onlyVisible: "Visible", onlyHidden: "Hidden", onlyFeatured: "Featured", hidden: "Hidden",
      categoryNameTr: "TR", categoryNameEs: "ES", categoryNameEn: "EN",
      noProducts: "No products match this filter.", noLinks: "No links found.", noCategories: "No categories found.",
      latest: "Latest", reset: "Reset", saveError: "Save error.", filters: "Filters",
      salesPriority: "Sales priority", productOrder: "Order no", totalProducts: "Total products",
      visibleProducts: "Visible", featuredProducts: "Featured", activeCategories: "Categories",
      taglineTr: "Tagline TR", taglineEs: "Tagline ES", taglineEn: "Tagline EN",
      socialLinks: "Social links", socialLinksHelp: "Use one line per item in Label | URL format."
    };
  }
  return {
    title: "Panel Admin", lead: "Gestiona el menú, los enlaces y la visibilidad.",
    envTitle: "Hace falta conectar Supabase", envLead: "Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    demoTitle: "Modo admin demo", demoLead: "Supabase no conectado. Los cambios quedan en esta sesión.",
    demoSave: "Demo guardado", email: "Correo", password: "Contraseña", signIn: "Entrar",
    magicLink: "Enviar magic link", signingIn: "Entrando...", workspace: "Espacio de trabajo",
    restaurantProfile: "Perfil del restaurante", categories: "Categorías", links: "Enlaces", products: "Productos",
    save: "Guardar", saveAll: "Guardar todo", saving: "Guardando...", saved: "✓ Guardado",
    unsaved: "● Cambios", signOut: "Salir", refresh: "Actualizar", counts: "Resumen",
    phone: "Teléfono", whatsapp: "WhatsApp", reviewUrl: "Link de Google reviews", hours: "Horario",
    address: "Dirección", customLink: "Enlace propio", name: "Nombre del negocio", price: "Precio (€)",
    available: "Visible", featured: "Destacado", priority: "Prioridad", rowOrder: "Orden",
    active: "Activo", statusReady: "Listo", magicLinkSent: "Magic link enviado. Revisa tu correo.",
    latestFeedback: "Últimos comentarios", latestScores: "Últimas puntuaciones", workspaceError: "No se pudo cargar.",
    searchProducts: "Buscar productos...", allCategories: "Todas las categorías", allProducts: "Todos",
    onlyVisible: "Visibles", onlyHidden: "Ocultos", onlyFeatured: "Destacados", hidden: "Oculto",
    categoryNameTr: "TR", categoryNameEs: "ES", categoryNameEn: "EN",
    noProducts: "No hay productos con este filtro.", noLinks: "No se encontraron enlaces.", noCategories: "No se encontraron categorías.",
    latest: "Últimos", reset: "Resetear", saveError: "Error al guardar.", filters: "Filtros",
    salesPriority: "Prioridad venta", productOrder: "Nº orden", totalProducts: "Total productos",
    visibleProducts: "Visibles", featuredProducts: "Destacados", activeCategories: "Categorías",
    taglineTr: "Eslogan TR", taglineEs: "Eslogan ES", taglineEn: "Eslogan EN",
    socialLinks: "Enlaces sociales", socialLinksHelp: "Usa una linea por item con formato Etiqueta | URL."
  };
}

function normalizeRowState(rows, fields) {
  return rows.reduce((acc, row) => {
    acc[row.id] = fields.reduce((f, field) => { f[field] = row[field]; return f; }, {});
    return acc;
  }, {});
}

function serializeSocialLinks(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .filter((item) => item && (item.label || item.url))
    .map((item) => `${item.label || ""}${item.url ? ` | ${item.url}` : ""}`.trim())
    .join("\n");
}

function parseSocialLinks(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (line.includes("|")) {
        const [labelPart, ...urlParts] = line.split("|");
        const label = labelPart.trim();
        const url = urlParts.join("|").trim();
        return url ? { label: label || `Link ${index + 1}`, url } : null;
      }

      return line ? { label: `Link ${index + 1}`, url: line } : null;
    })
    .filter(Boolean);
}

function normalizeProfileDraft(restaurant) {
  return {
    name: restaurant.name || "", phone: restaurant.phone || "",
    whatsapp_number: restaurant.whatsapp_number || "", google_review_url: restaurant.google_review_url || "",
    address: restaurant.address || "", hours: restaurant.hours || "", custom_link: restaurant.custom_link || "",
    tagline_tr: restaurant.tagline_tr || "", tagline_es: restaurant.tagline_es || "", tagline_en: restaurant.tagline_en || "",
    social_links_text: serializeSocialLinks(restaurant.social_links || [])
  };
}

function numberValue(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function patchesEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

function buildPatch(original, draft, fields, coerce = {}) {
  const patch = {};
  fields.forEach((field) => {
    const t = coerce[field] || ((v) => v);
    if (!patchesEqual(t(draft[field]), t(original[field]))) patch[field] = t(draft[field]);
  });
  return patch;
}

function buildProfilePatch(original, draft) {
  const patch = buildPatch(original, draft, PROFILE_FIELDS);
  const socialLinks = parseSocialLinks(draft.social_links_text);

  if (!patchesEqual(socialLinks, original.social_links || [])) {
    patch.social_links = socialLinks;
  }

  return patch;
}

function buildLookup(rows) {
  return rows.reduce((acc, row) => { acc[row.id] = row; return acc; }, {});
}

function localizedColumns(value = {}) {
  return { name_tr: value.tr || "", name_es: value.es || "", name_en: value.en || "" };
}
function descriptionColumns(value = {}) {
  return { description_tr: value.tr || "", description_es: value.es || "", description_en: value.en || "" };
}

function createDemoAdminWorkspace() {
  return {
    restaurant: {
      ...demoExperience.restaurant,
      tagline_tr: demoExperience.restaurant.tagline?.tr || "",
      tagline_es: demoExperience.restaurant.tagline?.es || "",
      tagline_en: demoExperience.restaurant.tagline?.en || ""
    },
    categories: demoExperience.categories.map((c) => ({ ...c, ...localizedColumns(c.name), is_active: c.is_active !== false })),
    products: demoExperience.products.map((p) => ({ ...p, ...localizedColumns(p.name), ...descriptionColumns(p.description), is_available: p.is_available !== false })),
    links: (demoExperience.links || []).map((l) => ({ ...l, is_active: l.is_active !== false })),
    feedback: { total: 3, latest: [{ id: "f1", star_rating: 5, platform: "google" }, { id: "f2", star_rating: 4, platform: "internal" }, { id: "f3", star_rating: 5, platform: "google" }] },
    leaderboard: { total: demoExperience.leaderboard?.length || 0, latest: demoExperience.leaderboard || [] }
  };
}

function StatusBadge({ status, isDirty, copy }) {
  const s = status === "saving" || status === "error" ? status : isDirty ? "dirty" : status || "idle";
  const label = s === "saving" ? copy.saving : s === "saved" ? copy.saved : s === "dirty" ? copy.unsaved : s === "error" ? copy.saveError : null;
  if (!label) return null;
  const color = s === "saved" ? "#22c55e" : s === "error" ? "#ef4444" : s === "dirty" ? "#f59e0b" : "#6b7280";
  return <span style={{ fontSize: "0.72rem", color, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}

export default function AdminPanel({ restaurantSlug, language: propLanguage = null, brandRestaurant = null }) {
  const [language] = useState(() => propLanguage || detectLanguage());
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
  const [expandedProduct, setExpandedProduct] = useState(null);

  const headerRestaurant = workspace?.restaurant || brandRestaurant;
  const categoryLookup = useMemo(() => buildLookup(workspace?.categories || []), [workspace?.categories]);
  const productLookup = useMemo(() => buildLookup(workspace?.products || []), [workspace?.products]);
  const linkLookup = useMemo(() => buildLookup(workspace?.links || []), [workspace?.links]);

  const productSummary = useMemo(() => {
    if (!workspace) return { total: 0, visible: 0, featured: 0, categories: 0 };
    return {
      total: workspace.products.length,
      visible: workspace.products.filter((p) => p.is_available).length,
      featured: workspace.products.filter((p) => p.is_signature).length,
      categories: workspace.categories.filter((c) => c.is_active).length
    };
  }, [workspace]);

  const profileDirty = useMemo(() => {
    if (!workspace || !profileDraft) return false;
    return Object.keys(buildProfilePatch(workspace.restaurant, profileDraft)).length > 0;
  }, [profileDraft, workspace]);

  const categoryDirtyIds = useMemo(() => {
    if (!workspace) return [];
    return workspace.categories.filter((c) => Object.keys(buildPatch(c, categoryDrafts[c.id] || {}, CATEGORY_FIELDS, { order_index: numberValue, is_active: Boolean })).length).map((c) => c.id);
  }, [categoryDrafts, workspace]);

  const linkDirtyIds = useMemo(() => {
    if (!workspace) return [];
    return workspace.links.filter((l) => Object.keys(buildPatch(l, linkDrafts[l.id] || {}, LINK_FIELDS, { is_active: Boolean, order_index: numberValue })).length).map((l) => l.id);
  }, [linkDrafts, workspace]);

  const productDirtyIds = useMemo(() => {
    if (!workspace) return [];
    return workspace.products.filter((p) => Object.keys(buildPatch(p, productDrafts[p.id] || {}, PRODUCT_FIELDS, { price: numberValue, sales_priority: numberValue, order_index: numberValue, is_available: Boolean, is_signature: Boolean })).length).map((p) => p.id);
  }, [productDrafts, workspace]);

  const filteredProducts = useMemo(() => {
    if (!workspace) return [];
    const q = productQuery.trim().toLowerCase();
    return workspace.products.filter((p) => {
      const matchCat = productCategoryFilter === "all" || p.category_id === productCategoryFilter;
      const draft = productDrafts[p.id] || {};
      const matchVis = productVisibilityFilter === "all"
        || (productVisibilityFilter === "visible" && Boolean(draft.is_available))
        || (productVisibilityFilter === "hidden" && !Boolean(draft.is_available))
        || (productVisibilityFilter === "featured" && Boolean(draft.is_signature));
      const hay = [p.name_es, p.name_en, p.name_tr].filter(Boolean).join(" ").toLowerCase();
      return matchCat && matchVis && (!q || hay.includes(q));
    });
  }, [productCategoryFilter, productDrafts, productQuery, productVisibilityFilter, workspace]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      hydrateWorkspace(createDemoAdminWorkspace());
      setWorkspaceStatus("ready");
      return undefined;
    }
    let mounted = true;
    getAdminSession().then((s) => { if (mounted) { setSession(s); setWorkspaceStatus(s ? "loading" : "auth"); } }).catch(() => { if (mounted) setWorkspaceStatus("auth"); });
    const unsub = subscribeAdminAuth((s) => { setSession(s); setWorkspaceStatus(s ? "loading" : "auth"); if (!s) setWorkspace(null); });
    return () => { mounted = false; unsub(); };
  }, [restaurantSlug]);

  useEffect(() => { if (session && hasSupabaseConfig) refreshWorkspace(); }, [restaurantSlug, session]);

  function hydrateWorkspace(w) {
    setWorkspace(w);
    setProfileDraft(normalizeProfileDraft(w.restaurant));
    setCategoryDrafts(normalizeRowState(w.categories, CATEGORY_FIELDS));
    setProductDrafts(normalizeRowState(w.products, PRODUCT_FIELDS));
    setLinkDrafts(normalizeRowState(w.links, LINK_FIELDS));
  }

  async function refreshWorkspace(showLoading = true) {
    if (showLoading) setWorkspaceStatus("loading");
    try {
      const w = await loadAdminWorkspace(restaurantSlug);
      hydrateWorkspace(w);
      setWorkspaceStatus("ready");
      setAuthError("");
    } catch (e) {
      setAuthError(e.message || copy.workspaceError);
      setWorkspaceStatus("error");
    }
  }

  function resetDrafts() { if (workspace) { hydrateWorkspace(workspace); setSaveState({}); } }
  function setRowStatus(key, status) { setSaveState((s) => ({ ...s, [key]: status })); }

  async function handlePasswordSignIn(e) {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try { await signInAdminWithPassword(authForm); } catch (err) { setAuthError(err.message || "Login failed"); } finally { setAuthBusy(false); }
  }

  async function handleMagicLink() {
    if (!authForm.email) { setAuthError(copy.email); return; }
    setAuthBusy(true);
    setAuthError("");
    try { await sendAdminMagicLink({ email: authForm.email, restaurantSlug }); setAuthError(copy.magicLinkSent); } catch (err) { setAuthError(err.message || "Magic link failed"); } finally { setAuthBusy(false); }
  }

  async function handleProfileSave() {
    if (!workspace || !profileDraft) return;
    const patch = buildProfilePatch(workspace.restaurant, profileDraft);
    if (!Object.keys(patch).length) { setRowStatus("profile", "saved"); return; }
    setRowStatus("profile", "saving");
    if (isDemoAdmin) {
      const r = { ...workspace.restaurant, ...patch };
      setWorkspace((w) => ({ ...w, restaurant: r }));
      setProfileDraft(normalizeProfileDraft(r));
      setRowStatus("profile", "saved");
      return;
    }
    try { const r = await updateRestaurantProfile(workspace.restaurant.id, patch); setWorkspace((w) => ({ ...w, restaurant: r })); setProfileDraft(normalizeProfileDraft(r)); setRowStatus("profile", "saved"); } catch { setRowStatus("profile", "error"); }
  }

  async function handleCategorySave(id) {
    const cat = categoryLookup[id], draft = categoryDrafts[id];
    if (!cat || !draft) return;
    const patch = buildPatch(cat, draft, CATEGORY_FIELDS, { order_index: numberValue, is_active: Boolean });
    if (!Object.keys(patch).length) { setRowStatus(id, "saved"); return; }
    setRowStatus(id, "saving");
    if (isDemoAdmin) {
      const updated = { ...cat, ...patch };
      setWorkspace((w) => ({ ...w, categories: w.categories.map((c) => c.id === id ? updated : c).sort((a, b) => a.order_index - b.order_index) }));
      setCategoryDrafts((d) => ({ ...d, [id]: CATEGORY_FIELDS.reduce((a, f) => { a[f] = updated[f]; return a; }, {}) }));
      setRowStatus(id, "saved");
      return;
    }
    try {
      const updated = await updateCategory(id, patch);
      setWorkspace((w) => ({ ...w, categories: w.categories.map((c) => c.id === id ? { ...c, ...updated } : c).sort((a, b) => a.order_index - b.order_index) }));
      setCategoryDrafts((d) => ({ ...d, [id]: CATEGORY_FIELDS.reduce((a, f) => { a[f] = updated[f]; return a; }, {}) }));
      setRowStatus(id, "saved");
    } catch { setRowStatus(id, "error"); }
  }

  async function handleLinkSave(id) {
    const link = linkLookup[id], draft = linkDrafts[id];
    if (!link || !draft) return;
    const patch = buildPatch(link, draft, LINK_FIELDS, { is_active: Boolean, order_index: numberValue });
    if (!Object.keys(patch).length) { setRowStatus(id, "saved"); return; }
    setRowStatus(id, "saving");
    if (isDemoAdmin) {
      const updated = { ...link, ...patch };
      setWorkspace((w) => ({ ...w, links: w.links.map((l) => l.id === id ? updated : l).sort((a, b) => a.order_index - b.order_index) }));
      setLinkDrafts((d) => ({ ...d, [id]: LINK_FIELDS.reduce((a, f) => { a[f] = updated[f]; return a; }, {}) }));
      setRowStatus(id, "saved");
      return;
    }
    try {
      const updated = await updateRestaurantLink(id, patch);
      setWorkspace((w) => ({ ...w, links: w.links.map((l) => l.id === id ? { ...l, ...updated } : l).sort((a, b) => a.order_index - b.order_index) }));
      setLinkDrafts((d) => ({ ...d, [id]: LINK_FIELDS.reduce((a, f) => { a[f] = updated[f]; return a; }, {}) }));
      setRowStatus(id, "saved");
    } catch { setRowStatus(id, "error"); }
  }

  async function handleProductSave(id) {
    const product = productLookup[id], draft = productDrafts[id];
    if (!product || !draft) return;
    const coerce = { price: numberValue, sales_priority: numberValue, order_index: numberValue, is_available: Boolean, is_signature: Boolean };
    const patch = buildPatch(product, draft, PRODUCT_FIELDS, coerce);
    if (!Object.keys(patch).length) { setRowStatus(id, "saved"); return; }
    setRowStatus(id, "saving");
    if (isDemoAdmin) {
      const updated = { ...product, ...patch };
      setWorkspace((w) => ({ ...w, products: w.products.map((p) => p.id === id ? updated : p).sort((a, b) => a.order_index - b.order_index) }));
      setProductDrafts((d) => ({ ...d, [id]: PRODUCT_FIELDS.reduce((a, f) => { a[f] = updated[f]; return a; }, {}) }));
      setRowStatus(id, "saved");
      return;
    }
    try {
      const updated = await updateProduct(id, patch);
      setWorkspace((w) => ({ ...w, products: w.products.map((p) => p.id === id ? { ...p, ...updated } : p).sort((a, b) => a.order_index - b.order_index) }));
      setProductDrafts((d) => ({ ...d, [id]: PRODUCT_FIELDS.reduce((a, f) => { a[f] = updated[f]; return a; }, {}) }));
      setRowStatus(id, "saved");
    } catch { setRowStatus(id, "error"); }
  }

  async function handleSaveAllCategories() { for (const id of categoryDirtyIds) await handleCategorySave(id); }
  async function handleSaveAllLinks() { for (const id of linkDirtyIds) await handleLinkSave(id); }
  async function handleSaveAllProducts() { for (const id of productDirtyIds) await handleProductSave(id); }

  const styles = {
    shell: { minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 0 80px" },
    hero: { background: "linear-gradient(135deg, #1a1a1a 0%, #111 100%)", borderBottom: "1px solid #222", padding: "24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
    heroLeft: { flex: 1 },
    heroSmall: { fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#f5a623", fontWeight: 700, marginBottom: 4 },
    heroTitle: { fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px", color: "#fff" },
    heroLead: { fontSize: "0.82rem", color: "#888", margin: 0 },
    heroBrand: { textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
    heroBrandImg: { width: 44, height: 44, borderRadius: "50%", objectFit: "cover" },
    heroBrandName: { fontSize: "0.82rem", fontWeight: 700, color: "#fff" },
    heroBrandSlug: { fontSize: "0.7rem", color: "#555" },
    notice: { margin: "16px 16px 0", background: "#1c1400", border: "1px solid #3d2e00", borderRadius: 10, padding: "12px 16px" },
    noticeTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#f5a623", margin: "0 0 4px" },
    noticeLead: { fontSize: "0.75rem", color: "#a07820", margin: "0 0 6px" },
    noticeCode: { fontSize: "0.7rem", background: "#111", border: "1px solid #333", borderRadius: 4, padding: "3px 8px", color: "#888", display: "inline-block" },
    authCard: { margin: "16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 14, padding: 20 },
    authLabel: { display: "block", marginBottom: 12 },
    authLabelSpan: { display: "block", fontSize: "0.75rem", color: "#888", marginBottom: 6, fontWeight: 600 },
    authInput: { width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: "0.9rem", padding: "10px 12px", outline: "none", boxSizing: "border-box" },
    authActions: { display: "flex", gap: 10, marginTop: 16 },
    primaryBtn: { background: "#f5a623", color: "#000", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", flex: 1 },
    ghostBtn: { background: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" },
    smallGhostBtn: { background: "transparent", color: "#888", border: "1px solid #2a2a2a", borderRadius: 6, padding: "6px 12px", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" },
    authNote: { fontSize: "0.78rem", color: "#f5a623", margin: "10px 0 0", textAlign: "center" },
    toolbar: { margin: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12 },
    summaryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
    summaryCard: { background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: "12px 10px", textAlign: "center" },
    summaryNum: { display: "block", fontSize: "1.6rem", fontWeight: 800, color: "#f5a623", lineHeight: 1 },
    summaryLabel: { display: "block", fontSize: "0.65rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 },
    toolbarActions: { display: "flex", gap: 8 },
    card: { margin: "16px 16px 0", background: "#1a1a1a", border: "1px solid #222", borderRadius: 14, overflow: "hidden" },
    cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #222" },
    cardHeadLeft: { display: "flex", alignItems: "center", gap: 10 },
    cardTitle: { fontSize: "0.9rem", fontWeight: 700, color: "#fff", margin: 0 },
    formGrid: { padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    formLabel: { display: "block" },
    formLabelSpan: { display: "block", fontSize: "0.7rem", color: "#666", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" },
    formInput: { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", padding: "9px 11px", outline: "none", boxSizing: "border-box" },
    formTextarea: { minHeight: 96, resize: "vertical", fontFamily: "inherit" },
    formInputWide: { gridColumn: "1 / -1" },
    helperText: { display: "block", color: "#666", fontSize: "0.72rem", marginTop: 6, lineHeight: 1.4 },
    list: { padding: "0 16px 16px" },
    productRow: { padding: "12px 0", borderBottom: "1px solid #1e1e1e", display: "flex", flexDirection: "column", gap: 8 },
    productRowTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
    productName: { fontSize: "0.88rem", fontWeight: 700, color: "#fff", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    productCat: { fontSize: "0.68rem", color: "#555", fontWeight: 500 },
    productRowControls: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
    priceInput: { width: 70, background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#f5a623", fontSize: "0.88rem", fontWeight: 700, padding: "6px 8px", outline: "none", textAlign: "center" },
    toggle: { display: "flex", alignItems: "center", gap: 4, cursor: "pointer" },
    toggleLabel: { fontSize: "0.72rem", color: "#777", userSelect: "none" },
    expandBtn: { background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "0.75rem", padding: "4px 6px" },
    expandedFields: { background: "#111", borderRadius: 8, padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
    expandedLabel: { display: "block" },
    expandedLabelSpan: { display: "block", fontSize: "0.65rem", color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" },
    expandedInput: { width: "100%", background: "#0a0a0a", border: "1px solid #222", borderRadius: 5, color: "#aaa", fontSize: "0.8rem", padding: "6px 8px", outline: "none", boxSizing: "border-box" },
    catRow: { padding: "12px 0", borderBottom: "1px solid #1e1e1e" },
    catRowTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    catRowName: { fontSize: "0.88rem", fontWeight: 700, color: "#fff" },
    catRowFields: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 60px", gap: 8, alignItems: "end" },
    catInput: { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#fff", fontSize: "0.8rem", padding: "7px 9px", outline: "none", boxSizing: "border-box" },
    catFieldLabel: { display: "block", fontSize: "0.65rem", color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" },
    linkRow: { padding: "12px 0", borderBottom: "1px solid #1e1e1e", display: "flex", flexDirection: "column", gap: 8 },
    linkRowTop: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    linkKind: { fontSize: "0.82rem", fontWeight: 700, color: "#f5a623" },
    linkFields: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, alignItems: "end" },
    filterPanel: { padding: "12px 16px", borderBottom: "1px solid #1e1e1e", display: "flex", flexDirection: "column", gap: 10 },
    filterInput: { width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", padding: "9px 12px", outline: "none", boxSizing: "border-box" },
    chipRow: { display: "flex", gap: 6, flexWrap: "wrap" },
    chip: { padding: "5px 12px", borderRadius: 20, border: "1px solid #2a2a2a", background: "transparent", color: "#777", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" },
    chipActive: { background: "#f5a623", color: "#000", border: "1px solid #f5a623" },
    feedbackRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e1e1e" },
    stars: { color: "#f5a623", fontSize: "0.82rem", fontWeight: 700 },
    platform: { fontSize: "0.72rem", color: "#555" },
    empty: { padding: "20px 0", textAlign: "center", color: "#444", fontSize: "0.82rem" },
    select: { background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.82rem", padding: "8px 10px", outline: "none" }
  };

  return (
    <main style={styles.shell} translate="no">
      {/* HERO */}
      <header style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.heroSmall}>{copy.workspace}</p>
          <h1 style={styles.heroTitle}>{copy.title}</h1>
          <p style={styles.heroLead}>{copy.lead}</p>
        </div>
        {headerRestaurant && (
          <div style={styles.heroBrand}>
            {headerRestaurant.logo_image_url && <img src={headerRestaurant.logo_image_url} alt="" style={styles.heroBrandImg} />}
            <strong style={styles.heroBrandName}>{headerRestaurant.name}</strong>
            <span style={styles.heroBrandSlug}>{restaurantSlug}</span>
          </div>
        )}
      </header>

      {/* DEMO NOTICE */}
      {isDemoAdmin && (
        <div style={styles.notice}>
          <p style={styles.noticeTitle}>{copy.demoTitle}</p>
          <p style={styles.noticeLead}>{copy.demoLead}</p>
          <code style={styles.noticeCode}>VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY</code>
        </div>
      )}

      {/* AUTH */}
      {hasSupabaseConfig && !session && (
        <div style={styles.authCard}>
          <form onSubmit={handlePasswordSignIn}>
            <label style={styles.authLabel}>
              <span style={styles.authLabelSpan}>{copy.email}</span>
              <input type="email" style={styles.authInput} value={authForm.email} onChange={(e) => setAuthForm((f) => ({ ...f, email: e.target.value }))} autoComplete="email" />
            </label>
            <label style={styles.authLabel}>
              <span style={styles.authLabelSpan}>{copy.password}</span>
              <input type="password" style={styles.authInput} value={authForm.password} onChange={(e) => setAuthForm((f) => ({ ...f, password: e.target.value }))} autoComplete="current-password" />
            </label>
            <div style={styles.authActions}>
              <button type="submit" style={styles.primaryBtn} disabled={authBusy}>{authBusy ? copy.signingIn : copy.signIn}</button>
              <button type="button" style={styles.ghostBtn} onClick={handleMagicLink} disabled={authBusy}>{copy.magicLink}</button>
            </div>
            {authError && <p style={styles.authNote}>{authError}</p>}
          </form>
        </div>
      )}

      {/* WORKSPACE */}
      {hasAdminAccess && (
        <>
          {/* TOOLBAR */}
          <div style={styles.toolbar}>
            <div style={styles.summaryGrid}>
              {[
                { num: productSummary.total, label: copy.totalProducts },
                { num: productSummary.visible, label: copy.visibleProducts },
                { num: productSummary.featured, label: copy.featuredProducts },
                { num: productSummary.categories, label: copy.activeCategories }
              ].map((item) => (
                <div key={item.label} style={styles.summaryCard}>
                  <strong style={styles.summaryNum}>{item.num}</strong>
                  <span style={styles.summaryLabel}>{item.label}</span>
                </div>
              ))}
            </div>
            <div style={styles.toolbarActions}>
              <button type="button" style={styles.smallGhostBtn} onClick={() => isDemoAdmin ? hydrateWorkspace(createDemoAdminWorkspace()) : refreshWorkspace()}>{copy.refresh}</button>
              <button type="button" style={styles.smallGhostBtn} onClick={resetDrafts}>{copy.reset}</button>
              {!isDemoAdmin && <button type="button" style={styles.smallGhostBtn} onClick={signOutAdmin}>{copy.signOut}</button>}
            </div>
          </div>

          {workspaceStatus === "loading" && <div style={{ padding: "20px 16px", color: "#555", fontSize: "0.85rem" }}>Loading...</div>}
          {workspaceStatus === "error" && <div style={{ padding: "20px 16px", color: "#ef4444", fontSize: "0.85rem" }}>{authError || copy.workspaceError}</div>}

          {workspace && (
            <>
              {/* RESTAURANT PROFILE */}
              <div style={styles.card}>
                <div style={styles.cardHead}>
                  <div style={styles.cardHeadLeft}>
                    <h2 style={styles.cardTitle}>{copy.restaurantProfile}</h2>
                    <StatusBadge status={saveState.profile} isDirty={profileDirty} copy={copy} />
                  </div>
                  <button type="button" style={styles.primaryBtn} onClick={handleProfileSave}>{saveState.profile === "saving" ? copy.saving : copy.save}</button>
                </div>
                <div style={styles.formGrid}>
                  {[
                    { key: "name", label: copy.name, wide: false },
                    { key: "phone", label: copy.phone, wide: false },
                    { key: "whatsapp_number", label: copy.whatsapp, wide: false },
                    { key: "custom_link", label: copy.customLink, wide: false },
                    { key: "google_review_url", label: copy.reviewUrl, wide: true },
                    { key: "address", label: copy.address, wide: true },
                    { key: "hours", label: copy.hours, wide: true },
                    { key: "tagline_es", label: copy.taglineEs, wide: true },
                    { key: "tagline_tr", label: copy.taglineTr, wide: true },
                    { key: "tagline_en", label: copy.taglineEn, wide: true }
                  ].map(({ key, label, wide }) => (
                    <label key={key} style={{ ...styles.formLabel, ...(wide ? styles.formInputWide : {}) }}>
                      <span style={styles.formLabelSpan}>{label}</span>
                      <input style={styles.formInput} value={profileDraft?.[key] || ""} onChange={(e) => setProfileDraft((d) => ({ ...d, [key]: e.target.value }))} />
                    </label>
                  ))}
                  <label style={{ ...styles.formLabel, ...styles.formInputWide }}>
                    <span style={styles.formLabelSpan}>{copy.socialLinks}</span>
                    <textarea
                      rows={4}
                      style={{ ...styles.formInput, ...styles.formTextarea }}
                      value={profileDraft?.social_links_text || ""}
                      onChange={(e) => setProfileDraft((d) => ({ ...d, social_links_text: e.target.value }))}
                      placeholder="Instagram | https://instagram.com/..."
                    />
                    <small style={styles.helperText}>{copy.socialLinksHelp}</small>
                  </label>
                </div>
              </div>

              {/* CATEGORIES */}
              <div style={styles.card}>
                <div style={styles.cardHead}>
                  <div style={styles.cardHeadLeft}>
                    <h2 style={styles.cardTitle}>{copy.categories}</h2>
                    <StatusBadge status={saveState["categories-all"]} isDirty={categoryDirtyIds.length > 0} copy={copy} />
                  </div>
                  <button type="button" style={styles.primaryBtn} onClick={handleSaveAllCategories}>{copy.saveAll}</button>
                </div>
                <div style={styles.list}>
                  {workspace.categories.map((cat) => {
                    const draft = categoryDrafts[cat.id] || {};
                    const dirty = Object.keys(buildPatch(cat, draft, CATEGORY_FIELDS, { order_index: numberValue, is_active: Boolean })).length > 0;
                    return (
                      <div key={cat.id} style={styles.catRow}>
                        <div style={styles.catRowTop}>
                          <span style={styles.catRowName}>{cat.name_es || cat.name_en || cat.name_tr}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <StatusBadge status={saveState[cat.id]} isDirty={dirty} copy={copy} />
                            <label style={{ ...styles.toggle, marginLeft: 4 }}>
                              <input type="checkbox" checked={Boolean(draft.is_active)} onChange={(e) => setCategoryDrafts((d) => ({ ...d, [cat.id]: { ...d[cat.id], is_active: e.target.checked } }))} />
                              <span style={styles.toggleLabel}>{copy.active}</span>
                            </label>
                            <button type="button" style={styles.smallGhostBtn} onClick={() => handleCategorySave(cat.id)}>{saveState[cat.id] === "saving" ? copy.saving : copy.save}</button>
                          </div>
                        </div>
                        <div style={styles.catRowFields}>
                          {[
                            { field: "name_es", label: copy.categoryNameEs },
                            { field: "name_tr", label: copy.categoryNameTr },
                            { field: "name_en", label: copy.categoryNameEn }
                          ].map(({ field, label }) => (
                            <label key={field} style={styles.expandedLabel}>
                              <span style={styles.catFieldLabel}>{label}</span>
                              <input style={styles.catInput} value={draft[field] || ""} onChange={(e) => setCategoryDrafts((d) => ({ ...d, [cat.id]: { ...d[cat.id], [field]: e.target.value } }))} />
                            </label>
                          ))}
                          <label style={styles.expandedLabel}>
                            <span style={styles.catFieldLabel}>{copy.rowOrder}</span>
                            <input type="number" style={styles.catInput} value={draft.order_index ?? 0} onChange={(e) => setCategoryDrafts((d) => ({ ...d, [cat.id]: { ...d[cat.id], order_index: e.target.value } }))} />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LINKS */}
              <div style={styles.card}>
                <div style={styles.cardHead}>
                  <div style={styles.cardHeadLeft}>
                    <h2 style={styles.cardTitle}>{copy.links}</h2>
                    <StatusBadge status={saveState["links-all"]} isDirty={linkDirtyIds.length > 0} copy={copy} />
                  </div>
                  <button type="button" style={styles.primaryBtn} onClick={handleSaveAllLinks}>{copy.saveAll}</button>
                </div>
                <div style={styles.list}>
                  {workspace.links.map((link) => {
                    const draft = linkDrafts[link.id] || {};
                    const dirty = Object.keys(buildPatch(link, draft, LINK_FIELDS, { is_active: Boolean, order_index: numberValue })).length > 0;
                    return (
                      <div key={link.id} style={styles.linkRow}>
                        <div style={styles.linkRowTop}>
                          <span style={styles.linkKind}>{link.kind}</span>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <StatusBadge status={saveState[link.id]} isDirty={dirty} copy={copy} />
                            <label style={styles.toggle}>
                              <input type="checkbox" checked={Boolean(draft.is_active)} onChange={(e) => setLinkDrafts((d) => ({ ...d, [link.id]: { ...d[link.id], is_active: e.target.checked } }))} />
                              <span style={styles.toggleLabel}>{copy.active}</span>
                            </label>
                            <button type="button" style={styles.smallGhostBtn} onClick={() => handleLinkSave(link.id)}>{saveState[link.id] === "saving" ? copy.saving : copy.save}</button>
                          </div>
                        </div>
                        <div style={styles.linkFields}>
                          <label style={styles.expandedLabel}>
                            <span style={styles.catFieldLabel}>Label</span>
                            <input style={styles.catInput} value={draft.label || ""} onChange={(e) => setLinkDrafts((d) => ({ ...d, [link.id]: { ...d[link.id], label: e.target.value } }))} />
                          </label>
                          <label style={styles.expandedLabel}>
                            <span style={styles.catFieldLabel}>URL</span>
                            <input style={styles.catInput} value={draft.url || ""} onChange={(e) => setLinkDrafts((d) => ({ ...d, [link.id]: { ...d[link.id], url: e.target.value } }))} />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PRODUCTS */}
              <div style={styles.card}>
                <div style={styles.cardHead}>
                  <div style={styles.cardHeadLeft}>
                    <h2 style={styles.cardTitle}>{copy.products}</h2>
                    <StatusBadge status={saveState["products-all"]} isDirty={productDirtyIds.length > 0} copy={copy} />
                  </div>
                  <button type="button" style={styles.primaryBtn} onClick={handleSaveAllProducts}>{copy.saveAll}</button>
                </div>

                <div style={styles.filterPanel}>
                  <input style={styles.filterInput} value={productQuery} placeholder={copy.searchProducts} onChange={(e) => setProductQuery(e.target.value)} />
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <select style={styles.select} value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)}>
                      <option value="all">{copy.allCategories}</option>
                      {workspace.categories.map((c) => <option key={c.id} value={c.id}>{c.name_es || c.name_en}</option>)}
                    </select>
                    <div style={styles.chipRow}>
                      {[
                        { val: "all", label: copy.allProducts },
                        { val: "visible", label: copy.onlyVisible },
                        { val: "hidden", label: copy.onlyHidden },
                        { val: "featured", label: copy.onlyFeatured }
                      ].map(({ val, label }) => (
                        <button key={val} type="button" style={productVisibilityFilter === val ? { ...styles.chip, ...styles.chipActive } : styles.chip} onClick={() => setProductVisibilityFilter(val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={styles.list}>
                  {filteredProducts.length ? filteredProducts.map((product) => {
                    const draft = productDrafts[product.id] || {};
                    const coerce = { price: numberValue, sales_priority: numberValue, order_index: numberValue, is_available: Boolean, is_signature: Boolean };
                    const dirty = Object.keys(buildPatch(product, draft, PRODUCT_FIELDS, coerce)).length > 0;
                    const cat = categoryLookup[product.category_id];
                    const isExpanded = expandedProduct === product.id;

                    return (
                      <div key={product.id} style={styles.productRow}>
                        <div style={styles.productRowTop}>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <div style={styles.productName}>{product.name_es || product.name_en || product.name_tr}</div>
                            <div style={styles.productCat}>{cat?.name_es || cat?.name_en}</div>
                          </div>
                          <input type="number" min="0" step="0.1" style={styles.priceInput} value={draft.price ?? product.price} onChange={(e) => setProductDrafts((d) => ({ ...d, [product.id]: { ...d[product.id], price: e.target.value } }))} />
                        </div>
                        <div style={styles.productRowControls}>
                          <label style={styles.toggle}>
                            <input type="checkbox" checked={Boolean(draft.is_available)} onChange={(e) => setProductDrafts((d) => ({ ...d, [product.id]: { ...d[product.id], is_available: e.target.checked } }))} />
                            <span style={styles.toggleLabel}>{copy.available}</span>
                          </label>
                          <label style={styles.toggle}>
                            <input type="checkbox" checked={Boolean(draft.is_signature)} onChange={(e) => setProductDrafts((d) => ({ ...d, [product.id]: { ...d[product.id], is_signature: e.target.checked } }))} />
                            <span style={styles.toggleLabel}>{copy.featured}</span>
                          </label>
                          <button type="button" style={styles.expandBtn} onClick={() => setExpandedProduct(isExpanded ? null : product.id)}>{isExpanded ? "▲" : "▼"} {copy.salesPriority} / {copy.productOrder}</button>
                          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                            <StatusBadge status={saveState[product.id]} isDirty={dirty} copy={copy} />
                            <button type="button" style={styles.smallGhostBtn} onClick={() => handleProductSave(product.id)}>{saveState[product.id] === "saving" ? copy.saving : copy.save}</button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div style={styles.expandedFields}>
                            <label style={styles.expandedLabel}>
                              <span style={styles.expandedLabelSpan}>{copy.salesPriority}</span>
                              <input type="number" min="0" max="100" style={styles.expandedInput} value={draft.sales_priority ?? product.sales_priority} onChange={(e) => setProductDrafts((d) => ({ ...d, [product.id]: { ...d[product.id], sales_priority: e.target.value } }))} />
                            </label>
                            <label style={styles.expandedLabel}>
                              <span style={styles.expandedLabelSpan}>{copy.productOrder}</span>
                              <input type="number" min="0" style={styles.expandedInput} value={draft.order_index ?? product.order_index} onChange={(e) => setProductDrafts((d) => ({ ...d, [product.id]: { ...d[product.id], order_index: e.target.value } }))} />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  }) : <div style={styles.empty}>{copy.noProducts}</div>}
                </div>
              </div>

              {/* FEEDBACK + SCORES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, margin: "16px 16px 0" }}>
                <div style={{ ...styles.card, margin: 0, borderRadius: "14px 0 0 14px", borderRight: "none" }}>
                  <div style={styles.cardHead}>
                    <h2 style={styles.cardTitle}>{copy.latestFeedback}</h2>
                  </div>
                  <div style={{ padding: "4px 16px 16px" }}>
                    {workspace.feedback.latest.map((item) => (
                      <div key={item.id} style={styles.feedbackRow}>
                        <span style={styles.stars}>{"★".repeat(item.star_rating)}</span>
                        <span style={styles.platform}>{item.platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...styles.card, margin: 0, borderRadius: "0 14px 14px 0" }}>
                  <div style={styles.cardHead}>
                    <h2 style={styles.cardTitle}>{copy.latestScores}</h2>
                  </div>
                  <div style={{ padding: "4px 16px 16px" }}>
                    {workspace.leaderboard.latest.slice(0, 3).map((item) => (
                      <div key={item.id} style={styles.feedbackRow}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 80 }}>{item.player_name}</span>
                        <span style={{ ...styles.platform, color: "#f5a623", fontWeight: 700 }}>{item.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
