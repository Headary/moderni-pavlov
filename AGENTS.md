# Moderní Pavlov - Project Documentation for AI Agents

## Project Overview

**Moderní Pavlov** is a static website built with [Eleventy (11ty)](https://www.11ty.dev/) for a political party in a small Czech village. The site uses Bootstrap 5 for styling and SCSS for custom styles.

## Technology Stack

- **Static Site Generator**: Eleventy v3.1.5 (`@11ty/eleventy`)
- **CSS Framework**: Bootstrap 5.3.8
- **Styling**: SCSS (compiled to CSS)
- **Templating Engine**: Nunjucks (`.njk` files)
- **Content Format**: Markdown (`.md`)
- **Language**: Czech (cs)
- **Module System**: ES Modules (`"type": "module"`)

## Project Structure

```
moderni-pavlov/
├── src/                           # Source files (input directory)
│   ├── _includes/                 # Layout templates and components
│   │   ├── *.njk                  # Layout files
│   ├── css/
│   │   └── style.scss            # Main stylesheet (compiled to CSS)
│   ├── novinky/                   # News/articles section
│   │   ├── novinky.json          # Collection metadata
│   │   └── *.md                  # Individual article files
│   ├── *.md                       # Content pages (Markdown)
│   ├── *.njk                      # Collection/listing pages (Nunjucks)
│   └── src.json                   # Default layout configuration
├── _site/                         # Output directory (generated)
├── eleventy.config.js             # Eleventy configuration
├── package.json                   # Dependencies and build scripts
└── README.md                       # Czech language documentation
```

## Build and Development

### Commands

```bash
npm run build    # Generate static HTML to _site/
npm run dev      # Start dev server with live reload (http://localhost:8080)
```

### Build Features

- **Dev Server**: `eleventy --serve --incremental` provides live reloading
- **Production Build**: `eleventy` generates static files
- **SCSS Compilation**: Automatically compiles `.scss` to `.css`
- **Pass-through Copy**: Bootstrap JS bundle copied to `assets/`

## Technical Architecture

### 1. **Templating System**

- **Engine**: Nunjucks (`.njk`)
- **Base Template**: `_includes/base.njk` provides HTML structure, head, fonts, and scripts
- **Layout Hierarchy**: Content files reference layouts via front matter
- **Block System**: Nunjucks blocks enable nested layouts and content injection

### 2. **Collections**

- **Automatic Collections**: Glob patterns collect content by directory
- **Sorting**: Collections can be sorted by metadata (e.g., date)
- **Usage**: Template files iterate over collections to create listing pages

### 3. **Styling**

- **Format**: SCSS (Sass)
- **Output**: Compiled to CSS in `_site/css/`
- **Bootstrap Integration**: Bootstrap included as dependency, assets bundled
- **Partials**: SCSS files prefixed with `_` are treated as imports, not compiled
- **Customization**: Can override Bootstrap variables before imports

### 4. **Path Prefix Support**

- **Environment Variable**: `ELEVENTY_PATH_PREFIX` enables hosting on subpaths
- **Filter**: `| url` filter on all links to handle path prefixing
- **Use Case**: Host on `example.com/subpath/` without hard-coding paths
- **Configuration**: Set in `eleventy.config.js` and applied via filter

### 5. **Asset Management**

- **Bootstrap JS**: `node_modules/bootstrap/dist/js/bootstrap.bundle.min.js` → `_site/assets/bootstrap.bundle.min.js`
- **CSS**: Custom SCSS compiled to `_site/css/style.css`
- **Fonts**: Google Fonts loaded from CDN in base template

## Configuration Details

### `eleventy.config.js`

- **SCSS Extension**: Custom config for SCSS compilation with dependency tracking
- **Collections**: Filters for specific content types
- **Filters**: Custom Nunjucks filter `url` for path handling
- **Directories**: Input from `src/`, output to `_site/`
- **Template Engines**: Nunjucks for Markdown and HTML templating

### `src.json`

- **Global Front Matter**: Sets default layout for all files in `src/`
- **Applies To**: All content unless overridden per-file

### `package.json`

- **Type**: ES Module
- **Scripts**: Build and dev commands
- **Dependencies**: Eleventy, Bootstrap, Sass

## Content Organization

### File Types

- **`.md` files**: Markdown content with YAML front matter
    - Front matter specifies: layout, title, date, and custom data
    - Converted to HTML by Eleventy
- **`.njk` files**: Nunjucks templates for listing/collection pages
    - Can contain Nunjucks logic (loops, conditionals, filters)
- **`.json` files**: Collection metadata and configuration
    - Applied as front matter to sibling files
- **`.scss` files**: Stylesheets
    - Compiled to CSS during build

### Front Matter

- **Required**: `layout` (which `.njk` template to use)
- **Common**: `title`, `date`, `tags`, custom data
- **Nunjucks Access**: All data available as variables in templates

## Common Development Tasks

### Add New Content

1. Create `.md` file in appropriate directory
2. Add front matter with layout and title
3. Write content in Markdown
4. File automatically included in build

### Create a Collection

1. Organize files in directory (e.g., `novinky/`)
2. Create `.json` file with collection metadata
3. Reference collection in `.njk` template
4. Use in config to add collection (if custom sorting needed)

### Modify Layouts

1. Edit `.njk` files in `src/_includes/`
2. Use Nunjucks syntax: `{% block %}`, `{% if %}`, `{% for %}`
3. Reference other templates with `{% extends "base.njk" %}`
4. Insert content with `{% block content %}{% endblock %}`

### Update Styling

1. Edit `src/css/style.scss`
2. Create SCSS partials with `_` prefix (e.g., `_buttons.scss`)
3. Import partials: `@import "buttons"`
4. Changes apply on next build/reload

### Deploy

1. Run `npm run build`
2. Upload contents of `_site/` to web server
3. All files are static HTML/CSS/JS - no server-side processing needed

## Important Considerations

- **Static Generation**: No server-side code execution; all pages pre-built
- **Path Handling**: Always use `| url` filter for links to support path prefix
- **Image files**: Image files are handled by eleventyImageTransformPlugin that autogenerates needed sizes. URL filter is not needed, automatically handled.
- **Language**: Content is in Czech; locale is `lang="cs"`
- **Responsive**: Bootstrap grid system used for responsive layouts
- **No Dynamic Content**: News/content must be rebuilt to appear; no CMS backend
- **Incremental Builds**: Dev mode supports `--incremental` for faster rebuilds
- **Asset Pipeline**: Bootstrap and fonts bundled; no external CDN required (except fonts.googleapis.com)

## Entry Points for Modifications

- **Navbar/Navigation**: `src/_includes/navbar.njk`
- **Base Styling**: `src/css/style.scss`
- **Base Template**: `src/_includes/base.njk` (HTML structure, head, meta tags)
- **Homepage Layout**: `src/_includes/home.njk`
- **Content Pages**: `.md` files in `src/`
- **Collection Pages**: `.njk` files listing content
