import path from "node:path";
import * as sass from "sass";

const scssConfig = {
    outputFileExtension: "css",

    // opt-out of Eleventy Layouts
    useLayouts: false,

    compile: async function (inputContent, inputPath) {
        let parsed = path.parse(inputPath);
        // Don’t compile file names that start with an underscore
        if (parsed.name.startsWith("_")) {
            return;
        }

        let result = sass.compileString(inputContent, {
            loadPaths: [parsed.dir || ".", this.config.dir.includes],
        });

        // Map dependencies for incremental builds
        this.addDependencies(inputPath, result.loadedUrls);

        return async (data) => {
            return result.css;
        };
    },
};

export default function (eleventyConfig) {
    // Copy Bootstrap JS file
    eleventyConfig.addPassthroughCopy({
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js":
            "assets/bootstrap.bundle.min.js",
    });

    // Add support for scss
    eleventyConfig.addExtension("scss", scssConfig);
    eleventyConfig.addTemplateFormats("scss");

    // Create a collection for news items sorted by date
    eleventyConfig.addCollection("news", function (collection) {
        return collection
            .getFilteredByGlob("src/novinky/**/*.md")
            .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    });

    // Add a filter to handle paths with pathPrefix.
    // Should be used only for absolute paths.
    const pathPrefix = process.env.ELEVENTY_PATH_PREFIX
        ? process.env.ELEVENTY_PATH_PREFIX.trimEnd("/")
        : "";
    eleventyConfig.addNunjucksFilter("url", function (url) {
        return pathPrefix ? pathPrefix + url : url;
    });

    return {
        dir: {
            input: "src",
            output: "_site",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        pathPrefix: pathPrefix + "/",
    };
}
