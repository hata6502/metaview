setInterval(() => {
  const description = document.querySelector('meta[name="description"]')?.content;
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
}, 1000);
