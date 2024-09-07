const express = require("express");
const router = express.Router();

const manualCrawlController = require("../controller/manualCrawlController")
const sitemapCrawlController = require("../controller/sitemapCrawl")

router.post("/crawl/target", manualCrawlController.manualWebCrawl)
router.post("/crawl/sitemap", sitemapCrawlController.sitemapCrawl)

module.exports = router;
