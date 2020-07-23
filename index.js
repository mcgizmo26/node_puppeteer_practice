const http = require('http');
const fs = require('fs');

const puppeteer = require('puppeteer');
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        (async () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            let topTvsURL = 'https://www.amazon.com/Best-Sellers-Electronics-Televisions/zgbs/electronics/172659';
            let browser = await puppeteer.launch({ headless: false });
            let page = await browser.newPage();
            let topTvString = "";

            await page.goto(topTvsURL, { waitUntil: 'networkidle2' });

            returnedTvArray = await page.evaluate((selector) => {
                return Array.from(document.querySelectorAll('ol[id="zg-ordered-list"]>li>span>div>span>a>div'), el => el.innerHTML);
            });

            returnedTvArray.forEach(el => {
                return topTvString += `<li>${el}</li>`
            });

            try {
                if (!fs.existsSync('./top_rated_tvs.json')) {

                    fs.writeFileSync('./top_rated_tvs.json', "[]");

                    const fileToConvert = fs.readFileSync('./top_rated_tvs.json', 'utf8');

                    let parsedData = await JSON.parse(fileToConvert);

                    parsedData.push(returnedTvArray);
                    fs.writeFileSync('./top_rated_tvs.json', JSON.stringify(parsedData));
                }
            } catch (err) {

            }
            res.write(`<html><body><ul>${topTvString}</ul></body></html>`);
            res.end();
        })();
    }
});

server.listen(3000, () => { });