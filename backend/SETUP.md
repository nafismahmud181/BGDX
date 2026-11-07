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
