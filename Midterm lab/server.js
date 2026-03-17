const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/gamepass", async (req,res)=>{

const browser = await puppeteer.launch({headless:true});
const page = await browser.newPage();

await page.goto(
"https://www.xbox.com/en-US/xbox-game-pass",
{waitUntil:"networkidle2"}
);

const games = await page.evaluate(()=>{

const results = [];

document.querySelectorAll("a").forEach(a=>{

const href = a.getAttribute("href");
const title = a.textContent.trim();

if(href && href.includes("/games/") && title.length>2){

results.push({
title,
link:"https://www.xbox.com"+href
});

}

});

return results.slice(0,40);

});

await browser.close();

res.json(games);

});

app.listen(3000,()=>{

console.log("Game Pass scraper running");

});
