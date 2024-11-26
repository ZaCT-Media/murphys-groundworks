const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = async function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);


  eleventyConfig.addPassthroughCopy("./src/css/**/*.css");
  eleventyConfig.addPassthroughCopy("./src/assets");

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
