function installCopy(language) {
  if (language === "tr") {
    return {
      eyebrow: "Ana ekrana ekle",
      title: "Menüyü uygulama gibi ac",
      lead: "Tek dokunusla daha hizli acilis, tam ekran gorunum ve cevrimdisi erisim.",
      primary: "Yukle",
      dismiss: "Simdilik kapat"
    };
  }

  if (language === "en") {
    return {
      eyebrow: "Add to home screen",
      title: "Open the menu like an app",
      lead: "Faster launch, full-screen feel and offline access in one tap.",
      primary: "Install",
      dismiss: "Not now"
    };
  }

  return {
    eyebrow: "Anadir a inicio",
    title: "Abre el menu como una app",
    lead: "Apertura mas rapida, vista a pantalla completa y acceso sin conexion.",
    primary: "Instalar",
    dismiss: "Ahora no"
  };
}

export default function InstallPrompt({ language, onInstall, onDismiss }) {
  const copy = installCopy(language);

  return (
    <section className="install-callout pressable-card" aria-label={copy.eyebrow}>
      <div>
        <small>{copy.eyebrow}</small>
        <strong>{copy.title}</strong>
        <p>{copy.lead}</p>
      </div>

      <div className="install-callout-actions">
        <button type="button" className="primary-button" onClick={onInstall}>
          {copy.primary}
        </button>
        <button type="button" className="ghost-button" onClick={onDismiss}>
          {copy.dismiss}
        </button>
      </div>
    </section>
  );
}
