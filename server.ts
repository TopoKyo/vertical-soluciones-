import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Read Firebase config from the config file, not env vars, as it's public.
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
let projectId = "";
let databaseId = "";
try {
  const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
  projectId = config.projectId;
  databaseId = config.firestoreDatabaseId;
} catch (error) {
  console.error("Could not load Firebase config:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve robots.txt dynamically
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: ${req.protocol}://${req.get("host")}/sitemap.xml
`);
  });

  // Serve sitemap.xml dynamically
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const host = `${req.protocol}://${req.get("host")}`;
      
      let postsXml = "";
      // Fetch posts directly from Firestore REST API to avoid SDK issues in Node
      if (projectId && databaseId) {
        try {
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/posts`;
          const response = await fetch(firestoreUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.documents) {
              data.documents.forEach((doc: any) => {
                const fields = doc.fields;
                if (fields && fields.status && fields.status.stringValue === "Publicada" && fields.slug) {
                  const slug = fields.slug.stringValue;
                  const updatedAt = fields.updatedAt?.timestampValue || fields.createdAt?.timestampValue || new Date().toISOString();
                  postsXml += `
  <url>
    <loc>${host}/foro/post/${slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
                }
              });
            }
          }
        } catch (error) {
          console.error("Error fetching posts for sitemap:", error);
        }
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/portafolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${host}/foro</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>${postsXml}
</urlset>`;
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
