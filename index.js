const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPad = devices['iPad Pro landscape'];

const axios = require('axios');
const fs = require('fs');
let num = 201710271402455;

async function run() {
    console.log('Start to crawl girl\'s pivtures...');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ash-host-window-bounds=1920x1080'], // 
      headless: true,
      ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    page.setViewport({width:1920, height:1080});
    page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36');
    // const url = `http://www.zx123.cn/xiaoguotu/${num}.html`;
    const url = `http://www.zx123.cn/xiaoguotu/201710281402880.html`;

    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.evaluate(() => {
      return document.getElementById('pic_type').submit();
    });
    
    for(var i = 0; i < 200; i++) {
      // await page.waitFor(2000);
      try {
        await page.evaluate(() => {
          return document.getElementById('right_Arrow').click();
        });
        await page.waitFor(2000);
        let imgURL = await page.evaluate(() => {
          const link = document.querySelector('#bigImg').src;
          return link
        });
        console.log(imgURL);
        await axios.get(imgURL, {
            responseType: 'stream'
        }).then(res => {
            res.data.pipe(fs.createWriteStream(`./tu/${num}.${imgURL.substr(imgURL.length-3)}`));
            num++;
            console.log('OK!');
        }).catch((e) => {
          console.log(e);
        });
      } catch(e) {
        console.log(e);
      }
      
    }
    page.close()

}
run();
