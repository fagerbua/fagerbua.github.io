export function handleUpload(event) {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (file.name !== "830012.html") {
        window.alert("Ugyldig filnavn. Forventet '830012.html'");
        reject();
      }
      const parser = new DOMParser();
      const parsed = parser.parseFromString(event.target.result, "text/html");
      resolve(parsed);
    };
    reader.onerror = (err) => {
      console.error(err);
      reject(err);
    };
    reader.onabort = (event) => {
      console.error(err);
      reject(event);
    };

    reader.readAsText(file);
  });
}

export async function loadFromServer(path) {
  const response = await fetch(path);
  const htmlString = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc;
}
