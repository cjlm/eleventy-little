const fs = require('fs');

const syntaxHighlighting = require('@11ty/eleventy-plugin-syntaxhighlight');
const inclusiveLangPlugin = require('@11ty/eleventy-plugin-inclusive-language');

const screenshotShortcode = require('./src/_includes/shortcodes/screenshot');
const fontsShortcode = require('./src/_includes/shortcodes/fonts');
const slideTransform = require('./src/_includes/transforms/slide');

module.exports = (eleventyConfig) => {
  eleventyConfig.addCollection('presentations', (collection) =>
    collection.getFilteredByGlob('src/presentations/*/*.md')
  );

  eleventyConfig.addPlugin(syntaxHighlighting, { templateFormats: 'md' });
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  eleventyConfig.addShortcode('screenshot', screenshotShortcode);
  eleventyConfig.addNunjucksAsyncShortcode('fonts', fontsShortcode);

  eleventyConfig.addTransform('slide', slideTransform);

  eleventyConfig.addPassthroughCopy('src/assets/styles/*.css');
  eleventyConfig.addPassthroughCopy('src/assets/themes/*.css');
  eleventyConfig.addPassthroughCopy('src/assets/styles/fonts');
  eleventyConfig.addPassthroughCopy('src/assets/images');

  eleventyConfig.addPassthroughCopy('src/assets/scripts');

  eleventyConfig.addPassthroughCopy('src/presentations/**/images/*');

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: 'data',
    },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
