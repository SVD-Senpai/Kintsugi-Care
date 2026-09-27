import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { lang } = useApp();

  const copy = {
    en: {
      title: "Spot livestock illness early. Get help fast.",
      subtitle:
        "Report symptoms in seconds, even offline. Get an instant risk check and connect straight to your nearest Veterinary Officer.",
      farmerCta: "I'm a Farmer — Report an animal",
      officerCta: "I'm a Vet/Officer — Open Dashboard",
      historyCta: "View my past reports",
    },
    hi: {
      title: "पशुओं की बीमारी जल्दी पहचानें। तुरंत मदद पाएं।",
      subtitle: "बिना इंटरनेट के भी लक्षण दर्ज करें। तुरंत जोखिम जांच पाएं और नज़दीकी पशु चिकित्सक से जुड़ें।",
      farmerCta: "मैं किसान हूं — पशु की रिपोर्ट करें",
      officerCta: "मैं पशु चिकित्सक हूं — डैशबोर्ड खोलें",
      historyCta: "मेरी पुरानी रिपोर्ट देखें",
    },
  }[lang];

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">{copy.title}</h1>
        <p className="home__subtitle">{copy.subtitle}</p>

        <div className="home__actions">
          <Link to="/report" className="btn btn--primary btn--lg">
            🐄 {copy.farmerCta}
          </Link>
          <Link to="/officer" className="btn btn--secondary btn--lg">
            🩺 {copy.officerCta}
          </Link>
        </div>
        <Link to="/history" className="home__link">
          {copy.historyCta} →
        </Link>
      </section>

      <section className="home__stamp-strip" aria-hidden="true">
        <div className="stamp">🌡️</div>
        <div className="stamp">🐄</div>
        <div className="stamp">📍</div>
        <div className="stamp">🩺</div>
        <div className="stamp">📶</div>
      </section>
    </div>
  );
}