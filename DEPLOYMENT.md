# Deployment Guide for Ruzmovie

This guide explains how to deploy the Ruzmovie application to various platforms with the new unified build system.

## Prerequisites

1. Make sure you have updated the `.env` files in both frontend and backend directories
2. Ensure all dependencies are installed (`npm install` in root directory)
3. Test the application locally before deployment

## Unified Build Process

The new setup allows building and deploying the entire application as a single unit:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

This will serve both the API and frontend from a single Node.js process.

## Deploying to Render (Recommended)

### Single Web Service Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Set the following options:
   - Name: `ruzmovie`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Branch: `main` (or your default branch)
5. Add environment variables:
   - `JWT_SECRET`: Your secret key
   - `DB_HOST`: Your database host
   - `DB_USER`: Your database username
   - `DB_PASSWORD`: Your database password
   - `DB_NAME`: Your database name
   - `DB_DIALECT`: `mysql`
   - `DB_PORT`: `3306`
6. Click "Create Web Service"

## Deploying to Heroku

### Single App Deployment

1. Install Heroku CLI if you haven't already
2. Login to Heroku: `heroku login`
3. Create a new app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set DB_HOST=your_database_host
   heroku config:set DB_USER=your_database_user
   heroku config:set DB_PASSWORD=your_database_password
   heroku config:set DB_NAME=your_database_name
   heroku config:set DB_DIALECT=mysql
   heroku config:set DB_PORT=3306
   ```
5. Deploy:
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

## Deploying to DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Set the following options:
   - Name: `ruzmovie`
   - Environment: `Node.js`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
5. Add environment variables in the "Environment Variables" section:
   - `JWT_SECRET`: Your secret key
   - `DB_HOST`: Your database host
   - `DB_USER`: Your database username
   - `DB_PASSWORD`: Your database password
   - `DB_NAME`: Your database name
   - `DB_DIALECT`: `mysql`
   - `DB_PORT`: `3306`
6. Click "Create Resources"

## Environment Variables Required

### Backend
- `JWT_SECRET`: Secret key for JWT token generation
- `DB_HOST`: Database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_DIALECT`: Database dialect (mysql, postgres, etc.)
- `DB_PORT`: Database port

### Frontend
- `REACT_APP_API_URL`: Backend API URL (for development only, not needed in production with unified build)

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Make sure the PORT environment variable is set correctly
2. **Database Connection**: Verify database credentials and connectivity
3. **Environment Variables**: Ensure all required environment variables are set
4. **Build Failures**: Check that all dependencies are correctly listed in package.json

### Checking Logs

- **Render**: Check logs in the Render dashboard
- **Heroku**: Use `heroku logs --tail` command
- **DigitalOcean**: Check deploy logs in the App Platform dashboard

## Scaling

For production deployments with high traffic, consider:

1. Separating frontend and backend into different services
2. Using a CDN for frontend assets
3. Implementing load balancing
4. Using a managed database service
5. Adding caching layers (Redis)