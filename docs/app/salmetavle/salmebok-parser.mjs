export function parseSalmebok(salmebok) {
  const hymnSections = Array.from(salmebok.querySelectorAll("section")).filter(
    (it) => it.id.startsWith("level2_")
  );

  // Salme 1 is formatted differently
  const firstHymnSection = salmebok.createElement("section");
  firstHymnSection.appendChild(salmebok.querySelector("h1#h1_5"));
  firstHymnSection.appendChild(salmebok.querySelector("#level2_1"));
  hymnSections[0] = firstHymnSection;

  const parsed = hymnSections.map((section) => {
    const heading = section.querySelector("h1, h3")?.innerText;
    if (heading == null) {
      return;
    }
    const match = heading.match(/^Salme (([\d]+)(\.(\d))?) (.*)$/);
    const [_, printNumber, mainNumber, __, suffix, title] = match;
    const poems = Array.from(section.querySelectorAll(".poem")).map((poem) => {
      const stanzas = Array.from(poem.querySelectorAll(".linegroup"));
      return {
        lang: poem.lang,
        text: stanzas
          .map((stanza) => stanza.innerText)
          .map((text) => text.replace(/&ensp;/g, " ")),
      };
    });
    return {
      title,
      mainNumber,
      suffix,
      printNumber,
      poems,
    };
  });
  return parsed;
}
