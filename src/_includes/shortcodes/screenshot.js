const Image = require('@11ty/eleventy-img');

module.exports = async (url) => {
  const encodedUrl = encodeURIComponent(url);
  const screenshotUrl = `https://screenshot.cjlm.dev/${encodedUrl}/large/1:1/bigger/`; //larger

  let metadata = await Image(screenshotUrl, {
    widths: [1024],
    formats: ['jpeg', 'avif'],
    urlPath: '/assets/images',
    outputDir: 'dist/assets/images',
  });

  let data = metadata.jpeg[metadata.jpeg.length - 1];

  return `<img src="${data.url}" alt="screenshot of ${url}">`;
};
