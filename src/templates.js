function getImageUrl(item) {
  // Try media:content first
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }

  // Then try enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // Finally try content
  if (item.content) {
    const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) return match[1];
  }

  return 'https://placehold.co/600x400/eee/999?text=No+Image';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateStoryHTML(item) {
  const imageUrl = getImageUrl(item);
  
  return `
    <article class="story-card">
      <div class="story-image">
        <img 
          src="${imageUrl}" 
          alt=""
          loading="lazy"
          onerror="this.src='https://placehold.co/600x400/eee/999?text=No+Image'"
        >
      </div>
      <div class="story-content">
        <h2 class="story-title">
          <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
        </h2>
        <time class="story-date">${formatDate(item.pubDate)}</time>
      </div>
    </article>
  `;
}

function generatePageHTML(feed) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${feed.title}</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header class="header">
        <div class="container">
          <h1>${feed.title}</h1>
        </div>
      </header>
      <div class="container">
        <main class="story-grid">
          ${feed.items.map(generateStoryHTML).join('')}
        </main>
      </div>
    </body>
    </html>
  `;
}

module.exports = { generatePageHTML };