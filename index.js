import * as cheerio from 'cheerio';
import rp from 'request-promise';
import dotenv from 'dotenv';
import pushover from './pushover.js';

dotenv.config();

const URL = 'https://tweakers.net/aanbod/zoeken/';
//3 minutes
const INTERVAL_TIME = 1000 * 60 * 3;
const keywords = process.env.KEYWORDS.split(',');
let previouseLinks = [];

const scrape = async () => {
    try {
        const html = await rp(URL);
        const $ = cheerio.load(html);
        const adverts = $("table.listing > tbody > tr > td > p.title.ellipsis > a")

        let links = []

        for (var i = 0; i < adverts.length; i++) {
            const element = adverts[i];

            const title = $(element).text();
            const link  = $(element).attr('href');

            if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
                if (previouseLinks.includes(link)) {
                    console.log(`Found a match: ${title}, but already notified.`);
                    return;
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
console.log('looking for: ', keywords.join(', '));
await scrape()
setInterval(async () => await scrape(), INTERVAL_TIME)





