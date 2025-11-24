# Deploy to GitHub

## Steps to Deploy

1. **Create the GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `swiftsite-labs`
   - Description: "SwiftSite Labs - Web Development Agency Website"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **After creating the repo, run these commands in your terminal:**

```bash
cd "C:\Users\nambi\OneDrive\Desktop\SwiftSite Labs"
git remote add origin https://github.com/YOUR_USERNAME/swiftsite-labs.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Alternative: If you want to use SSH

If you prefer SSH, use this command instead:
```bash
git remote add origin git@github.com:YOUR_USERNAME/swiftsite-labs.git
```

## After Deployment

Your website will be available at:
- Repository: `https://github.com/YOUR_USERNAME/swiftsite-labs`
- To deploy to GitHub Pages, go to Settings → Pages and enable it

