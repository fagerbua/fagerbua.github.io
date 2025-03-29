import { useRef, useState, h } from "./deps.mjs";

export function HymnBoard({ addHymn, removeHymn, selectedHymns, salmebok }) {
  const [input, setInput] = useState("");

  const inputRef = useRef(null);

  function addItem() {
    const number = input.trim();

    const lookup = hymnExists(number);
    if (!lookup.error) {
      addHymn(number);
      setInput("");
    } else {
      setValidationError(lookup.error);
    }
  }

  function findHymn(number) {
    return salmebok.find((it) => it?.printNumber === number);
  }

  function hymnExists(number) {
    const found = findHymn(number);
    if (found) {
      return { error: false, name: found.title };
    }
    if (!found) {
      return { error: `Fant ingen salme med nummer ${number}.` };
    }
  }

  function setValidationError(text) {
    inputRef.current.setCustomValidity(text);
    inputRef.current.reportValidity();
  }

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.setCustomValidity(""); // Reset validation message on input
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  return h`
    <div>
      <h2>Salmetavle</h2>
      <ul>
        ${selectedHymns.map((number) => {
          const { title } = findHymn(number);
          return h`<li>
              ${number} ${title}<button onClick=${() =>
            removeHymn(number)} title=${`Fjern ${number} fra salmetavla`}>
                \u2013
              </button>
            </li>`;
        })}
      </ul>
      <div class="add-hymn">
      <label>Legg til nummer:
      <input
        autofocus
        ref=${inputRef}
        type="text"
        value=${input}
        onInput=${handleInput}
        onKeyPress=${handleKeyPress}
      />
      </label>
      <button onClick=${addItem} title="Legg til på salmetavla">+</button>
      </div>
    </div>
  `;
}
