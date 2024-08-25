import axios from "axios";

const API_KEY = "your_crawlbase_api_key";

async function crawlWebsite(url: string) {
  try {
    const response = await axios.get(
      `https://api.crawlbase.com/?token=${API_KEY}&url=${encodeURIComponent(
        url
      )}`
    );

    console.log("Data:", response.data);
  } catch (error) {
    console.error("Error crawling the website:", error);
  }
}

const targetUrl = "https://example.com"; 

crawlWebsite(targetUrl);
