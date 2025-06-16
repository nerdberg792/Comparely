import puppeteer, { Browser, Page , CookieData} from 'puppeteer';
import { SessionData } from '../types';

const blockedResourceTypes = [
  'image',
  'stylesheet',
  'font'
];

export async function launchBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true, 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=1200,800'
    ]
  });
  return browser;
}

export async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (blockedResourceTypes.includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return page;
}

export async function restoreSession(page: Page, sessionData: SessionData , browser : Browser ): Promise<void> {
  if (sessionData && sessionData.cookies) {
    const cookies: CookieData[] = sessionData.cookies.map((c: any) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      expires: c.expires,
      httpOnly: c.httpOnly,
      secure: c.secure,
      session: c.session
    }));
    await browser.setCookie(...cookies);
  }
  if (sessionData && sessionData.url) {
    await page.goto(sessionData.url, { waitUntil: 'domcontentloaded' });
  }
}

export async function captureSession(page: Page, phoneNumber: string , browser : Browser): Promise<SessionData> {
  await page.evaluate(() => {
        document.cookie = 'myCookie = MyCookieValue';
      });
  const cookies = await browser.cookies() 
  const url = page.url();
  return { sessionId: '', phoneNumber, cookies, url  }; 
}