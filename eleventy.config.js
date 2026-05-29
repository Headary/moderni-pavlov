export default function(eleventyConfig) {
    // Passthrough copy CSS files
    eleventyConfig.addPassthroughCopy("src/css");

    return {
        dir: {
            input: "src",
            includes: "_includes",
            layouts: "_layouts",
            output: "_site",
        },
    };
}
