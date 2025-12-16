# 🚨 URGENT: Follow These Steps Immediately

## The Situation
Your Firebase API key was exposed in a public GitHub repository. While I've removed it from the current code, you **MUST** revoke the old key and generate new credentials.

---

## ⚡ CRITICAL ACTIONS (Do These NOW)

### Step 1: Revoke the Exposed API Key ⏱️ ~2 minutes

1. **Open Firebase Console**:
   - Go to: https://console.firebase.google.com/
   - Select project: `pkkm-sports-carnival`

2. **Delete or Regenerate Web App**:
   - Click the gear icon (⚙️) → **Project settings**
   - Scroll to **Your apps** section
   - Find your web app configuration
   - Click the three dots (⋮) → **Delete app** OR click app → **Regenerate config**

3. **Create New Web App** (if you deleted):
   - Click **Add app** → Select web icon (`</>`)
   - Name it: `PKKM Sports Carnival`
   - Click **Register app**
   - **COPY the new configuration** (you'll need this for Step 3)

### Step 2: Restrict API Key in Google Cloud ⏱️ ~3 minutes

1. **Open Google Cloud Console**:
   - Go to: https://console.cloud.google.com/
   - Select project: `pkkm-sports-carnival`

2. **Go to Credentials**:
   - Left menu → **APIs & Services** → **Credentials**
   - Find **API Keys** section
   - Find the key for your Firebase app

3. **Add Restrictions**:
   - Click the key name to edit
   - Under **Application restrictions**:
     - Select: `HTTP referrers (web sites)`
     - Click **ADD AN ITEM**
     - Add: `https://*.vercel.app/*` (for Vercel)
     - Add: `http://localhost:*/*` (for development)
     - Add your custom domain if you have one

   - Under **API restrictions**:
     - Select: `Restrict key`
     - Check ONLY these:
       - ✅ Firebase Realtime Database API
       - ✅ Firebase Authentication API
       - ✅ Identity Toolkit API

   - Click **SAVE**

### Step 3: Update Local Environment ⏱️ ~1 minute

1. **Open your `.env` file** (create it if it doesn't exist):
   ```
   C:\Users\Hp\OneDrive\Yukti AI\My Projects\Event Manager\.env
   ```

2. **Paste your NEW Firebase config**:
   ```env
   VITE_FIREBASE_API_KEY=your_NEW_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=pkkm-sports-carnival.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://pkkm-sports-carnival-default-rtdb.asia-southeast1.firebasedatabase.app
   VITE_FIREBASE_PROJECT_ID=pkkm-sports-carnival
   VITE_FIREBASE_STORAGE_BUCKET=pkkm-sports-carnival.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_new_sender_id
   VITE_FIREBASE_APP_ID=your_new_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_new_measurement_id
   ```

3. **Test locally**:
   ```bash
   npm run dev
   ```
   - Open http://localhost:5173
   - Check if data loads correctly

### Step 4: Update Vercel Deployment ⏱️ ~2 minutes

1. **Go to Vercel Dashboard**:
   - https://vercel.com/dashboard

2. **Update Environment Variables**:
   - Select your project: `pkkm-event-manager`
   - Go to: **Settings** → **Environment Variables**
   - For EACH variable, click **Edit** and update with NEW value:
     - `VITE_FIREBASE_API_KEY` → paste new key
     - `VITE_FIREBASE_AUTH_DOMAIN` → update
     - `VITE_FIREBASE_DATABASE_URL` → update
     - `VITE_FIREBASE_PROJECT_ID` → update
     - `VITE_FIREBASE_STORAGE_BUCKET` → update
     - `VITE_FIREBASE_MESSAGING_SENDER_ID` → update
     - `VITE_FIREBASE_APP_ID` → update
     - `VITE_FIREBASE_MEASUREMENT_ID` → update

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click the three dots (⋮) on latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete
   - Test your live site

---

## 📋 Optional: Clean Git History

The leaked key is still in git history. To completely remove it:

### Option A: Using GitHub Web Interface (Easiest)

1. Go to your GitHub repository
2. Click on the **Secret scanning alert**
3. Click **Close as revoked** once you've regenerated the key
4. GitHub will stop showing the alert

### Option B: Rewrite Git History (Advanced)

⚠️ **WARNING**: This rewrites history - coordinate with team members!

```bash
# Backup your repo first
git branch backup-before-cleanup

# Remove the file from all commits
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch DEPLOYMENT.md' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Restore the current version (without secrets)
git checkout master

# Force push (THIS REWRITES PUBLIC HISTORY!)
git push origin --force --all
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Old Firebase API key deleted/regenerated
- [ ] New API key has HTTP referrer restrictions
- [ ] New API key restricted to only necessary APIs
- [ ] Local `.env` file updated with new credentials
- [ ] Local app works (test at http://localhost:5173)
- [ ] Vercel environment variables updated
- [ ] Vercel app redeployed successfully
- [ ] Live app works (test your Vercel URL)
- [ ] GitHub secret scanning alert closed

---

## 🆘 Troubleshooting

**App not working after update?**
1. Double-check all environment variables match Firebase console
2. Clear browser cache and try again
3. Check browser console for errors
4. Verify Vercel deployment logs

**Still seeing the alert on GitHub?**
1. Make sure you revoked the old key in Firebase
2. Click "Close as revoked" on the GitHub alert
3. It may take a few minutes to update

---

## 📞 Need Help?

If something isn't working:
1. Check Firebase Console for errors
2. Check Vercel deployment logs
3. Check browser console for errors
4. Verify all credentials are correct

---

**Estimated Total Time**: ~10 minutes
**Priority**: 🔴 CRITICAL - Do this immediately!

Your app will continue working during this process, but the old API key MUST be revoked to prevent unauthorized access.
