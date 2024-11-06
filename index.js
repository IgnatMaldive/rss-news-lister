const { createServer } = require('./src/server');
const { generatePageHTML } = require('./src/templates');

async function startServer() {
  const server = await createServer(generatePageHTML);
  const port = process.env.PORT || 3000;
  
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

startServer().catch(console.error);