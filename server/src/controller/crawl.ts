import axios from "axios";

// const API_KEY = "TIxcJmSqPu_Qzb0qMA0bZQ"; // normal token
const API_KEY = "1DXaFnDZnTdl9Sllk7oKAw";    // javascript token

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

const targetUrl = "https://example.com"; // target site url

crawlWebsite(targetUrl);
