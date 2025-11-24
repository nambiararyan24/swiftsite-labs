# Google Sheets Form Integration Setup

Follow these steps to connect your contact form to Google Sheets:

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "SwiftSite Labs Contact Form"
4. In the first row, add these headers:
   - Column A: `Timestamp`
   - Column B: `Name`
   - Column C: `Email`
   - Column D: `Message`

## Step 2: Create Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code and paste this script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const message = e.parameter.message || '';
    
    // Add the data to the sheet
    sheet.appendRow([timestamp, name, email, message]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾 icon) and name your project (e.g., "Contact Form Handler")

## Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Set the following:
   - **Description**: "Contact Form Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** that appears (it will look like: `https://script.google.com/macros/s/...`)

## Step 4: Update Your Website
1. Open `script.js` in your project
2. Find the line: `const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`
3. Replace it with your actual Web App URL from Step 3
4. Save the file

## Step 5: Test
1. Submit a test form on your website
2. Check your Google Sheet - you should see the entry appear!

## Security Note
- The Web App URL will be visible in your JavaScript code
- This is acceptable for contact forms, but be aware that anyone can see the URL
- Consider adding rate limiting or CAPTCHA if you're concerned about spam

## Troubleshooting
- If submissions don't appear, check the Apps Script execution log (View → Execution log)
- Make sure "Who has access" is set to "Anyone" (not "Only myself")
- Verify the column headers match exactly in your sheet

