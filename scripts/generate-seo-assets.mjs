import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const SITE_URL = "https://www.podmoremedia.com";
const ROOT = process.cwd();
const BLOG_ARTICLES_PATH = path.join(ROOT, "src", "blogArticles.ts");
const BLOG_DIR = path.join(ROOT, "blog");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const BLOG_INDEX_PATH = path.join(ROOT, "blog.html");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageMimeType(imagePath) {
  const extension = path.extname(imagePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return undefined;
}

function readPngDimensions(buffer) {
  if (buffer.toString("ascii", 12, 16) !== "IHDR") return undefined;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readJpegDimensions(buffer) {
  let offset = 2;
  const dimensions = [];
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) break;

    const size = buffer.readUInt16BE(offset);
    if (size < 2 || offset + size > buffer.length) break;

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      dimensions.push({
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      });
    }

    offset += size;
  }
  return dimensions.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
}

function imageDimensions(imagePath) {
  const publicRelativePath = imagePath.replace(/^\//, "");
  const absolutePath = path.join(ROOT, "public", publicRelativePath);
  if (!fs.existsSync(absolutePath)) return undefined;
  const buffer = fs.readFileSync(absolutePath);
  const extension = path.extname(imagePath).toLowerCase();
  if (extension === ".png") return readPngDimensions(buffer);
  if (extension === ".jpg" || extension === ".jpeg") return readJpegDimensions(buffer);
  return undefined;
}

async function loadBlogArticles() {
  const source = fs.readFileSync(BLOG_ARTICLES_PATH, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const encoded = Buffer.from(transpiled).toString("base64");
  const module = await import(`data:text/javascript;base64,${encoded}`);
  return module.blogArticles;
}

function articleUrl(article) {
  return `${SITE_URL}/blog/${article.slug}`;
}

function generateSitemap(articles) {
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/easy-ai-marketing-for-plumbers`,
    ...articles.map(articleUrl),
  ];

  const body = urls
    .map((url) => `  <url>\n    <loc>${escapeHtml(url)}</loc>\n  </url>`)
    .join("\n");

  fs.writeFileSync(
    SITEMAP_PATH,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  );
}

function generateBlogIndex(articles) {
  const links = articles
    .map((article) => `      <a href="/blog/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a>`)
    .join("\n");

  fs.writeFileSync(
    BLOG_INDEX_PATH,
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Practical local SEO, website, Google Business Profile, AI marketing and review advice for UK trades and local service businesses."
    />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE_URL}/blog" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Podmore Media Blog | Marketing Advice for UK Trades" />
    <meta
      property="og:description"
      content="Clear, useful advice on local visibility, websites, Google Business Profile, AI-assisted marketing and building trust online."
    />
    <meta property="og:url" content="${SITE_URL}/blog" />
    <meta property="og:image" content="${SITE_URL}/assets/podmore-media-logo-flat.png" />
    <meta property="og:site_name" content="Podmore Media" />
    <meta property="og:locale" content="en_GB" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Podmore Media Blog | Marketing Advice for UK Trades" />
    <meta
      name="twitter:description"
      content="Practical local SEO, website, Google Business Profile, AI marketing and review advice for UK trades and local service businesses."
    />
    <meta name="twitter:image" content="${SITE_URL}/assets/podmore-media-logo-flat.png" />
    <title>Podmore Media Blog | Marketing Advice for UK Trades</title>
  </head>
  <body>
    <nav
      aria-label="Published blog articles"
      style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;"
    >
${links}
    </nav>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  );
}

function generateArticlePage(article) {
  const title = article.seoTitle ?? article.title;
  const description = article.metaDescription ?? article.description;
  const canonical = articleUrl(article);
  const image = `${SITE_URL}${article.image}`;
  const mimeType = imageMimeType(article.image);
  const dimensions = imageDimensions(article.image);

  const optionalImageMeta = [
    mimeType ? `    <meta property="og:image:type" content="${escapeHtml(mimeType)}" />` : undefined,
    dimensions ? `    <meta property="og:image:width" content="${dimensions.width}" />` : undefined,
    dimensions ? `    <meta property="og:image:height" content="${dimensions.height}" />` : undefined,
  ]
    .filter(Boolean)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
${optionalImageMeta}
    <meta property="og:image:alt" content="${escapeHtml(article.imageAlt)}" />
    <meta property="og:site_name" content="Podmore Media" />
    <meta property="og:locale" content="en_GB" />
    <meta property="article:published_time" content="${escapeHtml(article.publishedIso)}" />
    <meta property="article:author" content="${escapeHtml(article.author)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(article.imageAlt)}" />
    <title>${escapeHtml(title)} | Podmore Media</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function generateArticlePages(articles) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (file.endsWith(".html")) fs.unlinkSync(path.join(BLOG_DIR, file));
  }
  for (const article of articles) {
    fs.writeFileSync(path.join(BLOG_DIR, `${article.slug}.html`), generateArticlePage(article));
  }
}

const articles = await loadBlogArticles();
generateSitemap(articles);
generateBlogIndex(articles);
generateArticlePages(articles);
console.log(`Generated SEO assets for ${articles.length} blog articles.`);
