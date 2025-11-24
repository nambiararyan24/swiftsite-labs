# Vercel Auto-Deployment Setup

## Option 1: GitHub Integration (Recommended - Auto-deploy on every push)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Your Repository:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find and select `nambiararyan24/swiftsite-labs`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other (or leave as default)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (already set in vercel.json)
   - **Output Directory:** `dist` (already set in vercel.json)
   - **Install Command:** `npm install` (default)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically:
     - Build your project
     - Deploy it
     - Give you a live URL

5. **Auto-Deployment is Now Active:**
   - Every time you push to the `main` branch on GitHub, Vercel will automatically:
     - Detect the changes
     - Build the project
     - Deploy the new version
     - Update your live site

## Option 2: Vercel CLI (Alternative)

If you prefer using CLI, run:
```bash
vercel
```

Then follow the prompts. After initial setup, you can link it to GitHub for auto-deployment.

## Your Live Site

After deployment, you'll get:
- **Production URL:** `https://swiftsite-labs.vercel.app` (or custom domain)
- **Preview URLs:** For every pull request and branch

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain

## Environment Variables (If Needed)

If you need to add environment variables:
1. Go to Project Settings → Environment Variables
2. Add any variables (like API keys)
3. Redeploy

---

**Note:** The `vercel.json` file is already configured for optimal deployment with Vite.

