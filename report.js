function printReport(pages) {
  const arr = Object.entries(pages);

  arr.sort((a, b) => b[1] - a[1]);
  for (let [url, count] of arr) {
    console.log(`Found ${count} internal links to ${url}`);
  }
}

module.exports = { printReport };
