const sendPage = () => {
  const url = location.href;

  const title =
    document.querySelector('meta[property="og:title"]')?.content ??
    document.title;

  const description = `${[
    title,
    url,
    document.querySelector('meta[name="description"]')?.content,
  ]
    .filter((line) => line)
    .join("\n\n")}\n\n`;

  const imageURL = document.querySelector('meta[property="og:image"]')?.content;

  const metadata = [
    ...[...document.querySelectorAll("meta[name]")].map((metaElement) =>
      JSON.stringify({
        name: metaElement.name,
        content: metaElement.content,
      })
    ),
    ...[...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (scriptElement) => JSON.stringify(JSON.parse(scriptElement.innerText))
    ),
  ].join("");

  chrome.runtime.sendMessage({
    url,
    description,
    imageURL,
    metadata,
    title,
  });
};

sendPage();
setInterval(sendPage, 1000);
