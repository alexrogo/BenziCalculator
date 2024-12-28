import type { DocumentHead } from "@builder.io/qwik-city";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
// import ImgDailydoselogo from "./media/DailyDoseLogo.svg?jsx";

export default component$(() => {
  // Signal für den Fakt
  const randomFact = useSignal("Lade deinen ersten Fakt");
  const isLoading = useSignal(true); // Ladezustand
  const factSource = useSignal(""); // Quelle des Fakts
  const factSourceUrl = useSignal(""); // URL der Quelle

  // Lade den Fakt beim Seitenaufruf

  useVisibleTask$(async () => {
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=de"
      );
      const data = await response.json();
      randomFact.value = data.text;
      factSource.value = data.source; // Quelle aus API
      factSourceUrl.value = data.source_url; // URL aus API
      isLoading.value = false; // Ladezustand abschließen
    } catch (error) {
      randomFact.value =
        "Ups, es ist ein Fehler aufgetreten. Bitte lade die Seite neu!";
      isLoading.value = false;
    }
  });

  return (
    <>
      <div class="landing-container">
        {/* Hero Section */}
        <header class="hero">
          {/* Icon */}
          {/* <ImgDailydoselogo class="logo" /> */}
          <img
            src="/media/DailyDoseLogo.svg"
            alt="Daily Dose Logo"
            class="logo"
          />

          {/* Text */}
          <h1 class="hero-title">Deine tägliche Dosis Wissen</h1>
          <p class="hero-subtitle">
            Ein Klick, ein Fakt – Unnützes Wissen für jeden Tag!
          </p>
        </header>

        {/* Random Fact */}
        {/* Random Fact Wrapper */}
        <div class="fact-box-wrapper">
          <div class="fact-box">
            {isLoading.value ? (
              <div class="spinner"></div> /* Spinner während des Ladens */
            ) : (
              <p>{randomFact.value}</p> /* Fakt nach dem Laden */
            )}
          </div>
        </div>

        {/* Button */}
        <div class="button-wrapper">
          {!isLoading.value ? (
            <button
              class="cta-button"
              onClick$={async () => {
                isLoading.value = true;
                try {
                  const response = await fetch(
                    "https://uselessfacts.jsph.pl/api/v2/facts/random?language=de"
                  );
                  const data = await response.json();
                  randomFact.value = data.text;
                  factSource.value = data.source; // Quelle aus API
                  factSourceUrl.value = data.source_url; // URL aus API
                  isLoading.value = false;
                } catch (error) {
                  randomFact.value =
                    "Ups, es ist ein Fehler aufgetreten. Bitte versuche es erneut!";
                  isLoading.value = false;
                }
              }}
            >
              Neuen Fakt generieren
            </button>
          ) : (
            <button class="cta-button hidden-button">
              Neuen Fakt generieren
            </button>
          )}

          {/* Quellen-Wrapper */}
          <div class="source-wrapper">
            {!isLoading.value && factSource.value && factSourceUrl.value ? (
              <div class="source">
                <p>
                  Quelle:{" "}
                  <a href={factSourceUrl.value} target="_blank" rel="noopener">
                    {factSource.value}
                  </a>
                </p>
              </div>
            ) : (
              <div></div> /* Platzhalter für konsistente Höhe */
            )}
          </div>
        </div>

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
