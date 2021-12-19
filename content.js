const sendPage = () => {
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

  const description = [
    document.querySelector('meta[name="description"]')?.content,
    metadata,
  ]
    .filter((line) => line)
    .join("\n\n");

  const imageURL = document.querySelector('meta[property="og:image"]')?.content;

  const title =
    document.querySelector('meta[property="og:title"]')?.content ??
    document.title;

  chrome.runtime.sendMessage({
    url: location.href,
    description,
    imageURL,
    title,
  });
};

sendPage();
setInterval(sendPage, 1000);
