import { fetchSitemap } from "./sitemapGetUrlList";
import { crawlContnet } from "./sitemapGetContents";
import { Request, Response } from "express";

const sitemapCrawl = async (req: Request, res: Response) => {
  const sitemapUrl = req.body?.data;
  console.log("show data", sitemapUrl);

  async function processSitemap(sitemapUrl: string) {
    const urls = await fetchSitemap(sitemapUrl);

    if (urls) {
      console.log("urls", urls);
    } else {
      console.log("error");
    }

    for (const url of urls) {
      const content = await crawlContnet(url);
      if (content) {
        console.log(`Content for ${url}:\n${content.substring(0, 200)}...`); // Limiting output for brevity
        // Here, you can save the content to a database or file system
      }
    }
  }

  processSitemap(sitemapUrl);
};

module.exports = {
  sitemapCrawl,
};
