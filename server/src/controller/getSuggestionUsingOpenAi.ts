import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getSEOSuggestions() {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo', // You can also use 'text-davinci-003'
      prompt: 'Generate a list of long-tail keywords for an article about "sustainable living practices".',
      max_tokens: 150,
      temperature: 0.7, // Adjust this for creativity in suggestions
    });

    console.log(response.data.choices[0].text.trim());
  } catch (error) {
    console.error('Error fetching SEO suggestions:', error);
  }
}

getSEOSuggestions();
