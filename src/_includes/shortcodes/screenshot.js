module.exports = (url) => {
  const encodedUrl = encodeURIComponent(url);
  const { width, height } = { width: 500, height: 500 };
  const screenshotUrl = `https://kind-sinoussi-7e9674.netlify.app/${encodedUrl}/large/1:1/bigger/`; //larger
  return `<img class="screenshot" src="${screenshotUrl}" loading="lazy" decoding="async" alt="">`;
};
