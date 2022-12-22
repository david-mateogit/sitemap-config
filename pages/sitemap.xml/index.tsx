import axios from "axios";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // retrieve the data for the specific route from a database or API
  const baseUrl = "https://sitemap-config.vercel.app";

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

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlChunks
      .map((_, i) => {
        return `
        <sitemap>
          <loc>${baseUrl}/sitemap.xml/sitemap-${i}.xml</loc>
        </sitemap>
      `;
      })
      .join("")}
  </sitemapindex>`;

  context.res.setHeader("Content-Type", "application/xml");
  context.res.write(sitemapIndex);
  context.res.end();

  return {
    props: {}
  };
};

export default function Sitemap() {}
