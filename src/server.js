const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const RSSParser = require('rss-parser');

const parser = new RSSParser({
  customFields: {
    item: [
      ['media:content', 'media:content']
    ]
  }
});

const rssUrl = 'https://rss.app/feeds/S4zhQ6MVubcUROVo.xml';

async function serveStatic(res, filePath, contentType) {
  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('Not found');
  }
}

async function createServer(generateHTML) {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/styles.css') {
      return serveStatic(res, path.join(__dirname, 'styles.css'), 'text/css');
    }

    if (req.url === '/') {
      try {
        const feed = await parser.parseURL(rssUrl);
        const html = generateHTML(feed);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      } catch (error) {
        console.error('Error fetching feed:', error);
        res.writeHead(500);
        res.end('Error loading feed');
      }
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  return server;
}

module.exports = { createServer };