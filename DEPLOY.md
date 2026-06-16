# VSUAL Professional Networking platform - Deployment Guide

This full-stack application utilizes **React (Vite) + TypeScript** on the client side, and high-performance **Express API routes** serving the live **VSUAL UI / Gemini 3.5 OCR capabilities**.

Here is how you can deploy your application with ease on both **GitHub** and **Vercel** or other cloud hosting providers.

---

## 🚀 Easy GitHub Deployment & Setup

1. **Create a GitHub Repository**:
   - Go to [github.new](https://github.new).
   - Create a new public or private repository (e.g., `vsual-networking`).
2. **Push the Code**:
   - Initialize git locally:
     ```bash
     git init
     git add .
     git commit -m "feat: initial commit of VSUAL platform"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/vsual-networking.git
     git push -u origin main
     ```

---

## ⚡ Easy Vercel Serverless Deployment

Our project is fully configured for Vercel out-of-the-box using the root `vercel.json` file. It automatically compiles static assets and mounts Express routes seamlessly as light API serverless functions.

1. **Import to Vercel**:
   - Visit the [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project** and authorize your GitHub account.
   - Import your newly created repository.
2. **Configure Environment Variables**:
   - In the Vercel import screen, expand **Environment Variables**.
   - Add your keys:
     - `GEMINI_API_KEY`: *Your Google AI Studio Gemini API Key*
     - *(Optional custom CRM keys such as GoHighLevel variables if desired)*
3. **Deploy**:
   - Click **Deploy**. Your frontend build will be prepared in under 30 seconds and the custom full-stack backend will run dynamically.

---

## 🛠️ Environment Variables Configuration (.env)

Make sure you copy the configuration template to your environment:

```env
# Google Gemini API key (for live OCR parsing)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📱 Features Pre-configured

- 📸 **Selfie Watermarker**: Premium watermark rendering done dynamically in the client with automatic contrast adjustments.
- 📇 **VSUAL Card Scanner**: Dynamic client & fallback API loops powered by **Gemini 3.5 Flash** with custom draft follow-up formulation.
- 🎯 **GoHighLevel Custom Integration**: Ready-to-go webhook custom client sync parameters located on the CRM panel tab.
