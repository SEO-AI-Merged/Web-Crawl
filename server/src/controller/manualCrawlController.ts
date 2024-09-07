import axios from "axios";
import { Request, Response } from "express";

// const API_KEY = "TIxcJmSqPu_Qzb0qMA0bZQ"; // normal token
const API_KEY = "1DXaFnDZnTdl9Sllk7oKAw"; // javascript token

const manualWebCrawl = async (req: Request, res: Response) => {
  const targetUrl = req.body?.data;
  let resData: string | undefined;

  const crawlWebsite = async (url: string) => {
    try {
      const response = await axios.get(
        `https://api.crawlbase.com/?token=${API_KEY}&url=${encodeURIComponent(
          url
        )}`
      );
      resData = await response?.data;
      console.log("resdata:", resData);

      if (resData) {
        res.send({ msg: resData });
      }
    } catch (error) {
      console.error("Error crawling the website:", error);
    }
  };

  crawlWebsite(targetUrl);
  console.log("resData====>", resData);

};

module.exports = {
  manualWebCrawl,
};
