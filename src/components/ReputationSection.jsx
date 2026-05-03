import { useMemo, useState } from "react";
import Icon from "./Icon.jsx";
import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { getReputationAction } from "../services/reputationService.js";

function toneCopy(language, stars, copy) {
  const isHigh = stars >= 4;

  if (language === "tr") {
    return isHigh
      ? {
          eyebrow: "Isterseniz",
          lead: "Deneyiminizi Google'da paylasmaniz bizi cok mutlu eder.",
          support: "Oncesinde bize yazmak isterseniz WhatsApp'tan da memnuniyetle doneriz.",
          primaryLabel: copy.googleAction,
          secondaryLabel: copy.whatsappAction
        }
      : {
          eyebrow: "Yaninizdayiz",
          lead: "Bir sey istediginiz gibi gitmediyse, bize yazin; birlikte ilgilenelim.",
          support: "Mesajiniz hem bu ziyareti toparlamamiza hem de hizmetimizi gelistirmemize yardimci olur.",
          primaryLabel: copy.whatsappAction,
          secondaryLabel: copy.saveInternal
        };
  }

  if (language === "en") {
    return isHigh
      ? {
          eyebrow: "If you would like",
          lead: "We would love to hear your experience on Google.",
          support: "If you prefer to speak with us first, WhatsApp is always open.",
          primaryLabel: copy.googleAction,
          secondaryLabel: copy.whatsappAction
        }
      : {
          eyebrow: "We are here to help",
          lead: "If anything felt off, send us a quick message and we will take care of it with you.",
          support: "Your note helps us improve and serve you better.",
          primaryLabel: copy.whatsappAction,
          secondaryLabel: copy.saveInternal
        };
  }

  return isHigh
    ? {
        eyebrow: "Si te apetece",
        lead: "Nos haria mucha ilusion leer tu experiencia en Google.",
        support: "Si prefieres hablar primero con nosotros, tambien puedes escribirnos por WhatsApp.",
        primaryLabel: copy.googleAction,
        secondaryLabel: copy.whatsappAction
      }
    : {
        eyebrow: "Estamos para ayudarte",
        lead: "Si algo no fue como esperabas, cuentanoslo y lo revisamos contigo.",
        support: "Tu mensaje nos ayuda a mejorar y a atenderte mejor tambien en esta visita.",
        primaryLabel: copy.whatsappAction,
        secondaryLabel: copy.saveInternal
      };
}

function scaleLabels(language) {
  if (language === "tr") {
    return ["Zayif", "Dusuk", "Orta", "Iyi", "Harika"];
  }

  if (language === "en") {
    return ["Low", "Soft", "Okay", "Great", "Top"];
  }

  return ["Bajo", "Suave", "Bien", "Muy bien", "Top"];
}

function welcomeCopy(language) {
  if (language === "tr") {
    return {
      eyebrow: "Nazik bir rica",
      title: "Fikrinizi bizimle paylasmaniz bizi gercekten mutlu eder.",
      lead: "Isterseniz deneyiminizi Google'da gorunur kilabilir, isterseniz bize dogrudan yazabilirsiniz.",
      prompt: "Size en uygun yolu acalim diye once kisa bir puan secin."
    };
  }

  if (language === "en") {
    return {
      eyebrow: "A kind invitation",
      title: "We would genuinely love to hear what you thought.",
      lead: "You can share your experience on Google or speak with us directly, whichever feels better for you.",
      prompt: "Choose a quick rating first and we will open the best next step."
    };
  }

  return {
    eyebrow: "Una invitacion amable",
    title: "Nos encantaria saber como ha sido tu experiencia.",
    lead: "Si te apetece, puedes compartirla en Google o escribirnos directamente por aqui.",
    prompt: "Elige primero una puntuacion y te abrimos la mejor opcion."
  };
}

export default function ReputationSection({ restaurant, language, copy, onSubmitFeedback, onTrackEvent }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const action = useMemo(() => {
    if (!stars) {
      return null;
    }

    return getReputationAction(stars, restaurant, copy.whatsappMessage);
  }, [copy.whatsappMessage, restaurant, stars]);

  const tone = useMemo(() => toneCopy(language, stars, copy), [copy, language, stars]);
  const labels = useMemo(() => scaleLabels(language), [language]);
  const welcome = useMemo(() => welcomeCopy(language), [language]);

  async function save(platform) {
    if (!stars) {
      return false;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      await onSubmitFeedback({ stars, comment, platform, language });
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function openGoogle() {
    await save("google");
    onTrackEvent("google_review_clicked", { stars });
    window.location.href = action.googleUrl;
  }

  async function openWhatsApp() {
    await save("whatsapp");
    onTrackEvent("whatsapp_clicked", { stars });
    window.location.href = action.whatsappUrl;
  }

  return (
    <section className="feedback-band" id="feedback">
      <div className="section-heading">
        <p className="eyebrow">{copy.feedback}</p>
        <h2>{copy.feedbackTitle}</h2>
        <p>{copy.feedbackLead}</p>
      </div>

      <div className="feedback-layout compact feedback-premium-layout">
        <div className="rating-panel feedback-premium-panel">
          <div className="feedback-welcome-card">
            <div className="feedback-welcome-copy">
              <small>{welcome.eyebrow}</small>
              <strong>{welcome.title}</strong>
              <p>{welcome.lead}</p>
              <div className="feedback-welcome-pills" aria-hidden="true">
                <span>
                  <Icon name="heart" size={14} />
                  Google
                </span>
                <span>
                  <Icon name="share" size={14} />
                  WhatsApp
                </span>
              </div>
            </div>

            <div className="feedback-welcome-visual" aria-hidden="true">
              <img className="feedback-welcome-cover" src={restaurant.cover_image_url || PLACEHOLDER_IMAGES.heroClean} alt="" />
              <span className="feedback-welcome-shade" />
              <img className="feedback-welcome-logo" src={restaurant.logo_image_url || PLACEHOLDER_IMAGES.logoLuxe} alt="" />
            </div>
          </div>

          <div className="feedback-route-strip" aria-hidden="true">
            <span className={stars > 0 && stars < 4 ? "is-active" : ""}>WhatsApp</span>
            <span className={stars >= 4 ? "is-active" : ""}>Google</span>
          </div>

          <p className="feedback-soft-prompt">{welcome.prompt}</p>

          <div className="stars premium-stars" aria-label={copy.chooseRating}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={stars >= value ? "star is-active" : "star"}
                aria-label={`${value} star`}
                onClick={() => {
                  setStars(value);
                  onTrackEvent("rating_selected", { stars: value });
                  if (navigator.vibrate) {
                    navigator.vibrate(28);
                  }
                }}
              >
                <Icon name="star" size={22} />
              </button>
            ))}
          </div>

          <div className="rating-scale">
            {labels.map((label, index) => (
              <span key={label} className={stars === index + 1 ? "is-active" : ""}>
                {label}
              </span>
            ))}
          </div>

          {stars > 0 ? (
            <div className={`feedback-journey-card ${action.primary === "google" ? "is-google" : "is-whatsapp"}`}>
              <small>{tone.eyebrow}</small>
              <strong>{stars >= 4 ? copy.highRatingTitle : copy.lowRatingTitle}</strong>
              <p>{tone.lead}</p>
              <span>{tone.support}</span>
            </div>
          ) : (
            <div className="feedback-preview-grid">
              <div className="feedback-preview-card">
                <small>WhatsApp</small>
                <strong>{copy.lowRatingTitle}</strong>
              </div>
              <div className="feedback-preview-card">
                <small>Google</small>
                <strong>{copy.highRatingTitle}</strong>
              </div>
            </div>
          )}

          <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder={copy.commentPlaceholder} rows="4" />

          {stars > 0 ? (
            <div className="feedback-actions premium-feedback-actions">
              {action.primary === "google" ? (
                <>
                  <button type="button" className="primary-button" disabled={isSaving} onClick={openGoogle}>
                    {tone.primaryLabel}
                  </button>
                  <button type="button" className="ghost-button" disabled={isSaving} onClick={openWhatsApp}>
                    {tone.secondaryLabel}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="primary-button" disabled={isSaving} onClick={openWhatsApp}>
                    {tone.primaryLabel}
                  </button>
                  <button type="button" className="ghost-button" disabled={isSaving} onClick={() => save("internal")}>
                    {tone.secondaryLabel}
                  </button>
                </>
              )}
            </div>
          ) : null}

          {status ? (
            <p className={`feedback-status ${status}`}>{status === "success" ? copy.feedbackSaved : copy.feedbackError}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
