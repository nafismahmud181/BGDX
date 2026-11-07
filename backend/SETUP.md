# BGDX + Google Sheets setup (5 minutes)

1. Open your tracker sheet. Make sure the tab is named **Actions** with the header row you already have (AID, Title, Domain, Ownership, Status, Priority, ...). Missing columns (Notes, Checklist, PR, Branch, Updated) are added automatically.
2. **Extensions > Apps Script**. Delete the sample code, paste all of `Code.gs`, save.
3. **Project Settings (gear) > Script properties > Add script property**: name `BGDX_KEY`, value = a long random secret (20+ characters). This is your access key.
4. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, authorize, and copy the **Web app URL** (ends in /exec).
5. Open BGDX, enter the URL, your key, and your owner name (as written in the Ownership column). Done.

Notes
- Without the key the URL returns "auth" and reads or writes nothing.
- To rotate the key, change `BGDX_KEY` in Script properties and sign in again on your devices.
- After editing Code.gs, use Deploy > Manage deployments > Edit > New version.
- Status dropdown values must stay: Backlog, In Progress, Blocked, Parked, Closed. Priority: Highest, Medium, Low, Lowest.

# Push notifications (Firebase, free)

1. Go to https://console.firebase.google.com > **Add project** (Analytics not needed).
2. **Web app (iPhone + browsers):** Project settings > General > **Add app > Web**. Copy the config values into `firebase-config.js`. Then Project settings > **Cloud Messaging > Web Push certificates > Generate key pair** and paste it as `vapidKey`.
3. **Android app:** Project settings > General > **Add app > Android**, package name `com.bgdmart.bgdx`. Download `google-services.json` into `android/app/`.
4. **Server key:** Project settings > **Service accounts > Generate new private key**. In Apps Script > Project Settings > Script properties, add `FCM_SERVICE_ACCOUNT` and paste the whole JSON file as the value. Never commit this file.
5. Paste the new `Code.gs`, save, then **Deploy > Manage deployments > Edit > New version**. Apps Script will ask for new permissions (external requests, triggers); allow them.
6. In the editor, select `setupDailyReminder` and press **Run** once (reminder at 9:00 sheet time; change `REMINDER_HOUR` to move it).
7. Rebuild: `npm run build`, publish the web files, rebuild the Android app.
8. In BGDX: **Account > Turn on notifications**. In the editor, run `testPush` to send a test to every registered device.

Notes
- iPhone: needs iOS 16.4+, and BGDX must be opened from the Home Screen icon (Share > Add to Home Screen). Safari tabs cannot receive push.
- Devices are stored in a hidden **Devices** tab. Dead tokens are removed automatically.
- Who gets what: new/reassigned task → new owner; status, priority or due change by someone else → owner; task moved to Blocked → every admin device; 9:00 → each person's due-today and overdue tasks. Nobody is notified about their own changes.
