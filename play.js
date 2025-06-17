import puppeteer, {Page , Browser } from "puppeteer" ; 


(async () => {
 
    const browser = await puppeteer.launch({headless : false }) ; 
    const page = await browser.newPage() ; 
    await page.goto("https://www.zeptonow.com/") ; 
    await page.waitForSelector("body > div.font-norms > div > div > div > div > header > div > div:nth-child(5) > button" , { visible: true }) ; 
    await page.click("body > div.font-norms > div > div > div > div > header > div > div:nth-child(5) > button")
   
    
    
    
    
    
    
    
    
})()