import axios from 'axios';
import * as cheerio from 'cheerio';

async function crawlContnet(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const content = $('body').text();
        return content;
    } catch (error) {
        console.error(`Error crawling URL ${url}: ${error}`);
        return null;
    }
}

export { crawlContnet };
