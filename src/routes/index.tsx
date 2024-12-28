import type { DocumentHead } from "@builder.io/qwik-city";
import { component$ } from "@builder.io/qwik";
import ImgDailydoselogo from "./media/DailyDoseLogo.svg?jsx";

export default component$(() => {
  return (
    <>
      <div class="landing-container">
        {/* Hero Section */}
        <header class="hero">
          {/* Icon */}
          <ImgDailydoselogo class="logo" />

          {/* Text */}
          <h1 class="hero-title">Deine tägliche Dosis Wissen</h1>
          <p class="hero-subtitle">
            Ein Klick, ein Fakt – Unnützes Wissen für jeden Tag!
          </p>
        </header>

        {/* Button */}
        <button
          class="cta-button"
          onClick$={() => alert("Funktion kommt bald!")}
        >
          Neuen Fakt generieren
        </button>

        {/* Footer */}
        <footer class="footer">
          <p>
            © {new Date().getFullYear()} Daily Dose – Alle Rechte vorbehalten.
          </p>
        </footer>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Daily Dose - Deine tägliche Dosis Wissen",
  meta: [
    {
      name: "description",
      content: "Erhalte jeden Tag unnützes Wissen – Ein Klick, ein Fakt!",
    },
    {
      name: "keywords",
      content: "unnützes Wissen, Random Facts, Spaß, Bildung",
    },
    {
      name: "Alexander Rogowski",
      content: "Daily Dose",
    },
  ],
};
