# Deployment Guide for Render

This guide will walk you through deploying your Size Predictor application on Render.

## Prerequisites

- A GitHub account
- The Size Predictor code in a GitHub repository

## Step 1: Prepare Your Repository

1. **Fork or Clone**: Make sure your code is in a GitHub repository
2. **Verify Files**: Ensure these files are in your repository:
   - `package.json`
   - `server.js`
   - `public/` folder with all files
   - `render.yaml` (optional but recommended)

## Step 2: Deploy on Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign in with your GitHub account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Repository**
   - Choose "Connect a repository"
   - Select your Size Predictor repository
   - Click "Connect"

4. **Configure Service**
   - **Name**: `size-predictor` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)

5. **Advanced Settings** (Optional)
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: Enable for automatic deployments

6. **Create Service**
   - Click "Create Web Service"
   - Render will start building and deploying your application

### Option B: Using render.yaml (Infrastructure as Code)

If you have the `render.yaml` file in your repository:

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

## Step 3: Monitor Deployment

1. **Watch Build Logs**
   - Monitor the build process in real-time
   - Check for any errors or warnings

2. **Verify Health Check**
   - Once deployed, visit: `https://your-app-name.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

3. **Test the Application**
   - Visit your main URL: `https://your-app-name.onrender.com`
   - Test the size prediction functionality

## Step 4: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain (e.g., `size-predictor.yourdomain.com`)

2. **Configure DNS**
   - Add CNAME record pointing to your Render service
   - Wait for DNS propagation (can take up to 48 hours)

## Step 5: Environment Variables (If Needed)

If you need to add environment variables:

1. Go to your service settings
2. Click "Environment"
3. Add key-value pairs as needed

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs for errors
   - Verify `package.json` has correct dependencies
   - Ensure all required files are in the repository

2. **Application Won't Start**
   - Check start command: should be `npm start`
   - Verify `server.js` is the main file
   - Check for port configuration issues

3. **Health Check Fails**
   - Verify `/health` endpoint exists in `server.js`
   - Check if application is listening on correct port

4. **Iframe Issues**
   - Ensure CORS is properly configured
   - Check iframe src URL is correct
   - Verify responsive design works

### Performance Optimization

1. **Enable Caching**
   - Add cache headers for static assets
   - Consider using CDN for better performance

2. **Monitor Usage**
   - Use Render's built-in monitoring
   - Set up alerts for high usage

3. **Scale Up** (if needed)
   - Upgrade to paid plan for better performance
   - Consider auto-scaling for high traffic

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Size prediction works
- [ ] Form validation functions
- [ ] Results display properly
- [ ] Mobile responsiveness works
- [ ] Iframe integration tested
- [ ] Health check endpoint responds
- [ ] Error handling works
- [ ] Loading states display correctly

## Support

If you encounter issues:

1. **Check Render Documentation**: [docs.render.com](https://docs.render.com)
2. **Review Build Logs**: Look for specific error messages
3. **Test Locally**: Ensure app works on your machine first
4. **Contact Support**: Use Render's support channels

## Next Steps

After successful deployment:

1. **Update Iframe URLs**: Replace `your-app-name` with your actual app name
2. **Test Integration**: Embed in your client website
3. **Monitor Performance**: Set up monitoring and alerts
4. **Backup**: Consider setting up automated backups
5. **Documentation**: Update your documentation with the live URL 