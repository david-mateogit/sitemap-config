import axios from "axios";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // retrieve the data for the specific route from a database or API
  const data = await axios
    .get(
      "https://raw.githubusercontent.com/david-mateogit/temp-url-db/main/data.json"
    )
    .then((response) => response.data);

  const urls = data.map((u: { url: string }) => u.url);

  const chunkSize = 5;
  const urlChunks = [];

  for (let i = 0; i < urls.length; i += chunkSize) {
    urlChunks.push(urls.slice(i, i + chunkSize));
  }

  const sitemaps = urlChunks.map((urlsChunk, i) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlsChunk
        .map((url: string) => {
          return `
          <url>
            <loc>${url}</loc>
          </url>
        `;
        })
        .join("")}
    </urlset>`;
  });

  const slug =
    context.params !== undefined && Array.isArray(context.params.slug)
      ? context.params.slug.join("")
      : context.params !== undefined && typeof context.params.slug === "string"
      ? context.params.slug
      : "sitemap-0.xml";

  const index = parseInt(slug.replace("sitemap-", "").replace(".xml", ""));

  const sitemap = sitemaps[index];

  context.res.setHeader("Content-Type", "application/xml");
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {}
  };
};

export default function Sitemap() {}
