# 🚨 SECURITY INCIDENT - LEAKED FIREBASE API KEY

## Incident Details
- **Date Detected**: 2025-12-16
- **Type**: Google Firebase API Key exposed in public repository
- **Severity**: HIGH
- **Status**: Being remediated

## Immediate Actions Required

### 1. ⚠️ REVOKE THE EXPOSED API KEY (DO THIS FIRST!)

Go to Firebase Console and regenerate your API key:

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pkkm-sports-carnival`
3. Go to **Project Settings** (gear icon) → **General**
4. Under **Your apps** → **Web app**
5. Click **"Regenerate Config"** or create a new web app
6. Copy the new credentials

### 2. Restrict API Key Usage

In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your API key
5. Click **Edit** and add restrictions:
   - **Application restrictions**: HTTP referrers
   - Add your domain: `your-vercel-domain.vercel.app`
   - Add localhost for development: `http://localhost:*`
6. **API restrictions**: Restrict to only these APIs:
   - Firebase Realtime Database API
   - Firebase Authentication API
   - Cloud Firestore API (if used)

### 3. Update Environment Variables

Update your local `.env` file with the NEW credentials:

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

### 4. Update Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update all Firebase credentials with the NEW values
5. Redeploy the application

### 5. Remove Secret from Git History

The secret has been removed from the latest commit, but it still exists in git history. Run these commands:

```bash
# Install BFG Repo Cleaner (easier than git filter-branch)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Or use git filter-branch (built-in)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch DEPLOYMENT.md" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remove history
git push origin --force --all
```

⚠️ **WARNING**: Force pushing will rewrite history. Notify team members!

### 6. Monitor for Unauthorized Access

Check Firebase for any suspicious activity:

1. Firebase Console → **Authentication** → Check for unknown users
2. Firebase Console → **Realtime Database** → Check for unusual data modifications
3. Firebase Console → **Usage** → Check for spike in API calls

## What Was Exposed

The following credentials were leaked in commit `e517c6f`:

- Firebase API Key
- Firebase Project ID
- Firebase Database URL
- Firebase App ID
- Other Firebase configuration details

## Prevention Measures

✅ **Completed:**
- Removed secrets from DEPLOYMENT.md
- Added security warnings to documentation
- `.env` files already in .gitignore

🔄 **In Progress:**
- Revoking old credentials
- Removing from git history

📋 **To Do:**
- Set up secret scanning in CI/CD
- Implement Firebase security rules with authentication
- Regular security audits

## Timeline

1. **2025-12-16 (2 hours ago)**: Secret leaked in commit `e517c6f`
2. **2025-12-16 (Now)**: GitHub detected and alerted
3. **2025-12-16 (Now)**: Removed from current code
4. **Next**: Revoke credentials and clean git history

## Contact

If you have questions about this incident:
- Contact: Technical Team
- Reference: GitHub Secret Scanning Alert #1

---

**Status**: 🟡 In Progress - Awaiting credential revocation and history cleanup
