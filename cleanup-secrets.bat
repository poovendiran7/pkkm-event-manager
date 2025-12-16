@echo off
REM Script to remove leaked secrets from git history
REM WARNING: This will rewrite git history - backup your repo first!

echo ========================================
echo  Git History Cleanup - Remove Secrets
echo ========================================
echo.
echo WARNING: This will rewrite git history!
echo Make sure you have a backup of your repository.
echo.
echo Press CTRL+C to cancel, or
pause

echo.
echo Step 1: Creating backup branch...
git branch backup-before-cleanup
echo Backup created: backup-before-cleanup
echo.

echo Step 2: Creating secrets file for replacement...
echo AIzaSyBzV4ewwMfBNJoedvUsQGHq11d86345U18 > secrets-to-remove.txt
echo pkkm-sports-carnival >> secrets-to-remove.txt
echo 356904454186 >> secrets-to-remove.txt
echo 1:356904454186:web:2b1a7695ac3224ddb6db53 >> secrets-to-remove.txt
echo G-9F49EM548S >> secrets-to-remove.txt
echo.

echo Step 3: Rewriting git history to remove secrets...
echo This may take a few minutes...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch DEPLOYMENT.md || true" --prune-empty --tag-name-filter cat -- --all

echo.
echo Step 4: Cleaning up...
git for-each-ref --format="delete %%(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo.
echo Step 5: Recreating DEPLOYMENT.md without secrets...
git checkout master
echo File should now be updated with placeholders instead of real secrets

echo.
echo ========================================
echo  Cleanup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review changes: git log --oneline
echo 2. If satisfied, force push: git push origin --force --all
echo 3. Delete backup: git branch -D backup-before-cleanup
echo.
echo IMPORTANT: After force pushing:
echo 1. Revoke old Firebase API key in Firebase Console
echo 2. Generate new credentials
echo 3. Update Vercel environment variables
echo.
pause
