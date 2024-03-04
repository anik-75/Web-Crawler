const { describe, expect, test } = require("@jest/globals");
const {
  normalizeURL,
  getURLsFromHTML,
  relativeToAbsolute,
} = require("./crawl");

describe("my crawler", () => {
  test("parse url", () => {
    expect(normalizeURL("http://blog.boot.dev/path/")).toBe(
      "blog.boot.dev/path"
    );
  });

  let relativeUrl = "/xyz";
  let baseURL = "https://www.example.com";
  test("relative url to absolute url", () => {
    expect(relativeToAbsolute(relativeUrl, baseURL)).toBe(
      "https://www.example.com/xyz"
    );
  });

  //
  let htmlBody = `<html>
  <body>
      <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
      <a href="/xyz"><span>Go to Boot.dev</span></a>
  </body>
  </html>
  `;
  test('count anchors',()=>{
    expect()
  })
});
