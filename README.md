<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0479dc92-7103-469b-adfd-f53f6cb1e818

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Open [.env.local](.env.local) and set:
   `GEMINI_API_KEY=your_actual_gemini_api_key`
3. Run the app:
   `npm run dev`

## GitHub Pages Deployment

This repository deploys the `dist` folder to GitHub Pages from the `main` branch via GitHub Actions.

Enable Pages once in repository settings:
- **Settings → Pages → Build and deployment → Source: GitHub Actions**
