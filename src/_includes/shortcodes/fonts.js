const fs = require('fs');

const GetGoogleFonts = require('get-google-fonts');

module.exports = async (fontName) => {
  const outputDir = './dist/assets/fonts';
  const cssFile = `${fontName}-font.css`;

  try {
    if (!fs.existsSync(`${outputDir}/${cssFile}`)) {
      const instance = new GetGoogleFonts({
        outputDir,
        cssFile: `./${cssFile}`,
      });

      const result = await instance.download(
        `https://fonts.googleapis.com/css2?family=${fontName}`
      );
      
    }
    return `<link rel="stylesheet" href="/assets/fonts/${cssFile}" />`;
  } catch (err) {
    console.error(err);
  }
};
