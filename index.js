import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import pushover from './pushover.js';

dotenv.config();

const URL = 'https://tweakers.net/aanbod/zoeken/';
const QUERY = "table.listing > tbody > tr > td > p.title.ellipsis > a"
const INTERVAL_TIME = 1000 * 60 * 3;
const KEYWORDS = process.env.KEYWORDS.split(',');
let previouseLinks = [];

const scrape = async () => {
    try {
        const response = await fetch(URL);
        const html = await response.text();
        const $ = cheerio.load(html);

        const adverts = $(QUERY)

        let links = []

        for (var i = 0; i < adverts.length; i++) {
            const element = adverts[i];

            const title = $(element).text();
            const link  = $(element).attr('href');

            links.push(link);

            if (KEYWORDS.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
                if (previouseLinks.includes(link)) {
                    console.log(`Found a match: ${title}, but already notified.`);
                    continue;
                }
                console.log(`Found a match: ${title}`);
                await pushover(process.env.PUSHOVER_TOKEN, process.env.PUSHOVER_USER, link);
            }
        }
        previouseLinks = links;
    } catch (error) {
        console.log(error);
    }
}
console.log('starting scraper');
console.log('looking for: ', KEYWORDS.join(', '));
await scrape()
setInterval(async () => await scrape(), INTERVAL_TIME)





