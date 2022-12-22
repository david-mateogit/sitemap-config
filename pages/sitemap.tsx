import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import sites from "./api/data.json";

const SITEMAP_URL_LIMIT = 5;

// This function generates a sitemap XML for a given list of URLs
function generateSitemapXML(urls: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `  </url>\n`;
  }
  xml += "</urlset>";
  return xml;
}

// This function generates a sitemap index XML for a given list of sitemap URLs
function generateSitemapIndexXML(sitemapUrls: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const sitemapUrl of sitemapUrls) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${sitemapUrl}</loc>\n`;
    xml += `  </sitemap>\n`;
  }
  xml += "</sitemapindex>";
  return xml;
}

// export async function getServerSideProps(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // Fetch the data for the sitemaps
//   const data = sites;

//   // Split the data into chunks for the individual sitemaps
//   const dataChunks = [];
//   for (let i = 0; i < data.length; i += SITEMAP_URL_LIMIT) {
//     dataChunks.push(data.map((u) => u.url).slice(i, i + SITEMAP_URL_LIMIT));
//   }

//   // Generate the sitemap URLs
//   const sitemapUrls = dataChunks.map((chunk, index) => {
//     // Generate the sitemap XML
//     const sitemapXml = generateSitemapXML(chunk);

//     // Write the sitemap XML to a file
//     fs.writeFileSync(`public/sitemap-${index}.xml`, sitemapXml);

//     // Return the URL for the sitemap
//     return `https://example.com/sitemap-${index}.xml`;
//   });

//   // Generate the sitemap index XML
//   const sitemapIndexXml = generateSitemapIndexXML(sitemapUrls);

//   res.setHeader("Content-Type", "text/xml");
//   // we send the XML to the browser
//   res.write(sitemapIndexXml);
//   res.end();
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch the data for the sitemaps
  const data = sites;

  // Split the data into chunks for the individual sitemaps
  const dataChunks = [];
  for (let i = 0; i < data.length; i += SITEMAP_URL_LIMIT) {
    dataChunks.push(data.map((u) => u.url).slice(i, i + SITEMAP_URL_LIMIT));
  }

  // Generate the sitemap URLs
  const sitemapUrls = dataChunks.map((chunk, index) => {
    // Generate the sitemap XML
    const sitemapXml = generateSitemapXML(chunk);

    // Write the sitemap XML to a file
    fs.writeFileSync(`public/sitemap-${index}.xml`, sitemapXml);

    // Return the URL for the sitemap
    return `https://example.com/sitemap-${index}.xml`;
  });

  // Generate the sitemap index XML
  const sitemapIndexXml = generateSitemapIndexXML(sitemapUrls);

  context.res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  context.res.write(sitemapIndexXml);
  context.res.end();
  return {
    props: {}
  };
};

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export default SiteMap;
