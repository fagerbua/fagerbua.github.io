import { h, useState, useEffect } from "./deps.mjs";
import { HymnBoard } from "./HymnBoard.mjs";
import { LyricsView } from "./LyricsView.mjs";
import { handleUpload, loadFromServer } from "./file-loader.mjs";
import { parseSalmebok } from "./salmebok-parser.mjs";

export function App() {
  const [salmebok, setSalmebok] = useState();
  const [parsedSalmebok, setParsedSalmebok] = useState();
  const [selectedHymns, setSelectedHymns] = useState([]);
  const [hymnsAltered, setHymnsAltered] = useState(false);

  function onInitialLoad() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("hymns");
    if (value) {
      setSelectedHymns(value.split(","));
    }
    if (params.get("dev")) {
      tryLoadFromServer();
    }
  }

  async function tryLoadFromServer() {
    try {
      const loaded = await loadFromServer("./HTML/830012.html");
      onLoadedSalmebok(loaded);
    } catch (e) {
      console.log("Unable to load", e);
    }
  }

  function onLoadedSalmebok(salmebok) {
    setSalmebok(salmebok);
    setParsedSalmebok(parseSalmebok(salmebok));
  }

  useEffect(onInitialLoad, []);

  useEffect(() => {
    const url = new URL(window.location);
    if (hymnsAltered) {
      url.searchParams.set("hymns", selectedHymns.join(","));
    }
    window.history.pushState({}, "", url);
  }, [hymnsAltered, selectedHymns]);

  async function handleFile(event) {
    onLoadedSalmebok(await handleUpload(event));
  }

  function addHymn(number) {
    setHymnsAltered(true);
    setSelectedHymns((prev) => [...prev, number]);
  }

  function removeHymn(number) {
    setHymnsAltered(true);
    setSelectedHymns((prev) => prev.filter((it) => it !== number));
  }

  const selectedParsedHymns = parsedSalmebok?.filter((entry) => {
    if (entry == null) {
      return;
    }
    return selectedHymns.includes(entry.printNumber);
  });

  return h`
            ${
              !parsedSalmebok &&
              h`<section class="about">
              <h2>Om salmetavla</h2>
              <p>Bruk av denne nettsiden forutsetter at du har lovlig mulighet til å låne Norsk salmebok fra <a href="https://tibi.no">Tibi</a> (tidligere NLB). All databehandling foregår i nettleseren på din maskin, og ingen data blir overført til tredjepart. Du er selv ansvarlig for å bruke tjenesten i tråd med åndsverksloven.</p>
              <p>Tjenesten er utviklet av Jarle Fagerheim og har ingen tilknytning til Den norske kirke, Tibi, KABB, eller Eide forlag. Tilbakemeldinger kan sendes på epost til jarle(krøllalfa).hey.com.</p>
                <p>Du må laste ned salmeboka som HTML-fil fra Tibi og legge den inn her for å starte.</p>
    <input type="file" title="Velg fil" id="fileInput" accept=".html" onChange=${handleFile} />
                </section>`
            }
                ${
                  parsedSalmebok &&
                  h`<section><${HymnBoard} selectedHymns=${selectedHymns} addHymn=${addHymn} removeHymn=${removeHymn} salmebok=${parsedSalmebok} /></section`
                }
                ${
                  selectedParsedHymns &&
                  h`<${LyricsView} hymns=${selectedParsedHymns} />`
                }
            `;
}
