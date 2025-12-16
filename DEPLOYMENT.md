# PKKM Sports Carnival 2.0 - Vercel Deployment Guide

## Prerequisites

- [Vercel Account](https://vercel.com/signup) (free)
- Git repository (GitHub, GitLab, or Bitbucket)
- Firebase project already set up

## Step 1: Prepare Your Code

Make sure all your changes are committed to Git:

```bash
git add .
git commit -m "Add Firebase integration for production"
git push
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository:
   - Select your repository from GitHub/GitLab/Bitbucket
   - Click **"Import"**

4. Configure Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   Click **"Environment Variables"** and add each of these:

   > **⚠️ SECURITY WARNING**: Never commit your actual Firebase credentials to Git!
   > Get these values from your Firebase Console → Project Settings → General → Your apps

   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.region.firebasedatabase.app
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

6. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts, then deploy to production
vercel --prod
```

## Step 3: Configure Firebase Security Rules

After deployment, secure your Firebase database:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pkkm-sports-carnival**
3. Click **"Realtime Database"** → **"Rules"**
4. Replace the rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note**: These rules allow anyone to read/write. For production, you should add authentication or at least restrict writes to specific users.

### More Secure Rules (Recommended for Production):

```json
{
  "rules": {
    "schedules": {
      ".read": true,
      ".write": true
    },
    "results": {
      ".read": true,
      ".write": true
    },
    "liveMatches": {
      ".read": true,
      ".write": true
    },
    "brackets": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 4: Test Your Deployment

1. Vercel will provide you with a URL like: `https://your-project.vercel.app`
2. Open the URL in your browser
3. Test the following:
   - ✅ View schedules
   - ✅ View results
   - ✅ View standings
   - ✅ View knockout brackets
   - ✅ Admin panel - add schedule
   - ✅ Admin panel - add result
   - ✅ Admin panel - set match live
   - ✅ Verify data syncs across multiple browser tabs/devices

## Step 5: Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `sports.pkkm.org`)
4. Follow Vercel's instructions to configure DNS

## Automatic Deployments

Every time you push to your main branch, Vercel will automatically:
- Build your app
- Run tests (if configured)
- Deploy to production

## Environment Variables Management

To update environment variables after deployment:

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add/edit/delete variables
4. Redeploy for changes to take effect

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure `package.json` has all dependencies

### Firebase Connection Issues
- Verify Firebase URL in environment variables
- Check Firebase Security Rules
- Ensure Firebase project is in the same region

### Data Not Syncing
- Open browser console for errors
- Verify Firebase Realtime Database is active
- Check network tab for Firebase requests

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Firebase database rules
4. Ensure all environment variables are set correctly

## Production Checklist

- [ ] Firebase security rules configured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if needed)
- [ ] Tested on multiple devices
- [ ] Tested adding schedules
- [ ] Tested adding results
- [ ] Tested live match functionality
- [ ] Verified real-time sync works

## Your Live URLs

- **Vercel Deployment**: Will be provided after deployment
- **Firebase Console**: https://console.firebase.google.com/project/pkkm-sports-carnival

---

**Deployed by**: Persatuan Kebajikan Kongu Malaysia (PKKM)
**Event**: Sports Carnival 2.0
