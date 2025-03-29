import { h } from "./deps.mjs";

export function LyricsView({ hymns }) {
  return hymns.map((hymn) => {
    const multilingual = hymn.poems.length > 1;
    return h`
    <section>
    <h2>${hymn.printNumber} ${hymn.title}</h2>
    ${hymn.poems.map((poem) => {
      return h`
      ${multilingual && h`<h3>${language(poem.lang)}</h3>`}
      ${poem.text.map((stanza) => {
        const lines = stanza.split("\n").filter((it) => !!it)
        return h`<p>${lines.map((line) => {
          return h`${line}<br />`;
        })}</p>`;
      })}
      `;
    })}
    </section>
    `;
  });
}

function language(langCode) {
  const langMap = {
    no: "Norsk",
    nn: "Nynorsk",
    nb: "Bokmål",
    smj: "Lulesamisk",
    fkv: "Kvensk",
    sma: "Sørsamisk",
    sme: "Nordsamisk",
    sv: "Svensk",
    en: "Engelsk",
    de: "Tysk",
    la: "Latin",
    es: "Spansk",
    yo: "Yoruba",
    fr: "Fransk",
    ar: "Arabisk",
    zu: "Zulu",
  };

  return langMap[langCode] || "Ukjent språk";
}
