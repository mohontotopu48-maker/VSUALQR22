import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./api/index";

const PORT = 3000;

// Start express server configuration & integrate Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Development Server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist/ folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(path.join(process.cwd(), "dist"), (req, res, next) => {
      next();
    });
    const express = require("express");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only start listening if we are running in full-stack server containers/development, and not in standard Vercel serverless functions environment
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`===================================================`);
      console.log(` VSUAL Server is now running on Port ${PORT}`);
      console.log(` Local Time: ${new Date().toISOString()}`);
      console.log(` Mode: ${process.env.NODE_ENV || "development"}`);
      console.log(`===================================================`);
    });
  }
}

startServer();

