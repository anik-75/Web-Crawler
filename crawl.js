const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function normalizeURL(str) {
  if (typeof str !== "string") return;
  try {
    const url = new URL(str);
    const host = url.hostname;
    let path = url.pathname;
    path = path.endsWith("/") ? path.slice(0, -1) : path;
    return host + path;
  } catch (err) {
    console.log(err);
    return err.message;
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  const anchors = dom.window.document.querySelectorAll("a");
  const urls = [];
  anchors.forEach((element) => {
    let href = element.href;
    if (href.startsWith("/")) {
      // relative url
      const url = relativeToAbsolute(href, baseURL);
      if (url) {
        urls.push(url);
      }
    } else {
      urls.push(href);
    }
  });
  return urls;
}

function relativeToAbsolute(href, baseURL) {
  try {
    const url = new URL(href, baseURL);
    return url.href;
  } catch (err) {
    console.log(err);
  }
  return null;
}

async function crawlPage(baseURL, currentURL, pages) {
  try {
    // console.log(`Crawling Page: ${currentURL}`);
    const baseUrlObj = new URL(baseURL);
    const currentUrlObj = new URL(currentURL);

    if (baseUrlObj.hostname === currentUrlObj.hostname) {
      const normalizeUrl = normalizeURL(currentURL);
      if (pages[normalizeUrl] > 0) {
        pages[normalizeUrl]++;
        return pages;
      }
      if (baseURL === currentURL) {
        pages[normalizeUrl] = 0;
      } else {
        pages[normalizeUrl] = 1;
      }
    }

    const response = await fetch(currentURL);
    if (response.status > 399) {
      // console.log(`HTTP Error: status code: ${response.status}`);
      return pages;
    }
    if (!response.headers.get("Content-Type").includes("text/html")) {
      // console.log(`Non HTML Content`);
      return pages;
    }

    const html = await response.text();
    const links = getURLsFromHTML(html, currentURL);
    await Promise.all(
      links.map(async (link) => {
        const linkDomain = new URL(link).hostname;
        if (baseUrlObj.hostname === linkDomain) {
          pages = await crawlPage(baseURL, link, pages);
        }
      })
    );
    return pages;
  } catch (err) {
    console.log(err.message);
    return pages;
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  relativeToAbsolute,
  crawlPage,
};
