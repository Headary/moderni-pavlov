import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
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
    // Add a filter to handle paths with pathPrefix.
    // Should be used only for absolute paths.
    const pathPrefix = process.env.ELEVENTY_PATH_PREFIX
        ? process.env.ELEVENTY_PATH_PREFIX.trimEnd("/")
        : "";
    eleventyConfig.addNunjucksFilter("url", function (url) {
        return pathPrefix ? pathPrefix + url : url;
    });

    // Image plugin for autoresizing
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        widths: [250, 500, 1000, 1500, 2000],
        urlPath: pathPrefix + "/img/",
        htmlOptions: {
            imgAttributes: {
                loading: "lazy",
                sizes: "(max-width: 250px) 250px, (max-width: 500px) 500px, (max-width: 1000px) 1000px, (max-width: 1500px) 1500px, 2000px",
            },
            pictureAttributes: {},
        },
    });

    // Copy assets from src/assets to _site/assets
    eleventyConfig.addPassthroughCopy("src/assets");

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
