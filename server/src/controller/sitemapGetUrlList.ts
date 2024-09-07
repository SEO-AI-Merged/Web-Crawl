import axios from "axios";
import { parseStringPromise } from "xml2js";

async function fetchSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await axios.get(sitemapUrl);
    const sitemapData = await parseStringPromise(response.data);
    const urls = sitemapData.urlset.url.map((entry: any) => entry.loc[0]);
    return urls;
  } catch (error) {
    console.error(`Error fetching sitemap: ${error}`);
    return [];
  }
}

export { fetchSitemap };
