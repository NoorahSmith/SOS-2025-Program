# Vercel Deployment Guide

This guide will help you deploy the USDC Buy/Sell DEX frontend to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository with the frontend code
- Node.js 18+ (Vercel will use this automatically)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your frontend code is in a GitHub repository with the following structure:
```
frontend/
├── package.json
├── vercel.json
├── .npmrc
├── craco.config.js
├── src/
└── public/
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set the following configuration:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: usdc-buy-sell-frontend
# - Directory: ./
# - Override settings? N
```

### 3. Environment Variables (Optional)

If you need to change any configuration for production, you can set environment variables in Vercel:

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add any necessary variables

### 4. Custom Domain (Optional)

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Common Issues

#### 1. Build Failures
**Error**: `npm error 404 Not Found - simple-swizzle`
**Solution**: The `.npmrc` file should resolve this. If it persists:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### 2. Webpack Polyfill Issues
**Error**: `Module not found: Error: Can't resolve 'crypto'`
**Solution**: The `craco.config.js` should handle this. Ensure it's in your repository.

#### 3. Build Timeout
**Error**: Build process times out
**Solution**: 
- Check if you have large files in your repository
- Ensure `node_modules` is in `.gitignore`
- Consider using Vercel Pro for longer build times

#### 4. Memory Issues
**Error**: JavaScript heap out of memory
**Solution**: Add to `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' craco build"
  }
}
```

### Build Configuration

The deployment uses these key files:

#### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_VERSION": "18"
  }
}
```

#### `.npmrc`
```
registry=https://registry.npmjs.org/
legacy-peer-deps=true
auto-install-peers=true
```

## Post-Deployment

### 1. Test Your Deployment
- Visit your Vercel URL
- Test wallet connection
- Verify market statistics load
- Test buy/sell functionality (on devnet)

### 2. Monitor Performance
- Check Vercel Analytics
- Monitor build logs
- Test on different devices/browsers

### 3. Update Configuration
If you need to change any settings:
- Update `src/utils/constants.ts` for different networks
- Modify `vercel.json` for build settings
- Update environment variables in Vercel dashboard

## Production Considerations

### Security
- Ensure you're using HTTPS (Vercel provides this automatically)
- Validate all user inputs
- Use environment variables for sensitive data

### Performance
- Enable Vercel Analytics
- Use Vercel's CDN for static assets
- Optimize images and assets

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor wallet connection issues
- Track transaction success rates

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review browser console for errors
3. Test locally first
4. Check Vercel documentation
5. Contact Vercel support if needed

---

**Note**: This frontend is configured for Solana Devnet. For mainnet deployment, update the network configuration in `src/utils/constants.ts` and ensure your program is deployed to mainnet.