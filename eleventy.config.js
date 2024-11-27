const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = async function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);


  eleventyConfig.addPassthroughCopy("./src/css/**/*.css");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy({ './src/robots.txt': '/robots.txt' });
  eleventyConfig.addPassthroughCopy('./src/_redirects');

  eleventyConfig.setBrowserSyncConfig({
    open: true,
    files: "./public/css/**/*.css",
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "public",
    },
    htmlTemplateEngine: "njk",
  };
};
