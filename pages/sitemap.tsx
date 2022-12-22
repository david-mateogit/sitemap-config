import { GetServerSideProps } from "next/types";
import fs from "fs";
import sites from "./data.json";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Fetch URLs for sitemap from API
  const urls = sites.map((u) => u.url);
  const baseUrl = "https://sitemap-config.vercel.app";
  // Split URLs into chunks of 50000
  const chunkSize = 10;
  const urlChunks = [];

  for (let i = 0; i < urls.length; i += chunkSize) {
    urlChunks.push(urls.slice(i, i + chunkSize));
  }

  // Generate sitemap index
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlChunks
      .map((urlsChunk, i) => {
        return `
        <sitemap>
          <loc>${baseUrl}/sitemap${i + 1}.xml</loc>
        </sitemap>
      `;
      })
      .join("")}
  </sitemapindex>`;

  // Generate individual sitemaps
  const sitemaps = urlChunks.map((urlsChunk, i) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlsChunk
        .map((url) => {
          return `
          <url>
            <loc>${url}</loc>
          </url>
        `;
        })
        .join("")}
    </urlset>`;
  });

  sitemaps.forEach((sitemap, i) => {
    fs.writeFileSync(`public/sitemap${i + 1}.xml`, sitemap);
  });

  // Set header to xml
  res.setHeader("Content-Type", "application/xml");
  res.write(sitemapIndex);
  res.end();
  return {
    props: {}
  };
};

export default function Sitemap() {}
