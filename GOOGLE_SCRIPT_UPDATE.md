# Update Google Apps Script for Vercel Deployment

If the form is still not working on Vercel, you may need to update your Google Apps Script to handle CORS properly. Here's the updated script:

## Updated Google Apps Script Code

Replace your current `doPost` function with this version that handles CORS:

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
    
    // Return success with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Also add doGet for GET requests (used as fallback)
function doGet(e) {
  return doPost(e);
}
```

## Steps to Update:

1. Go to your Google Apps Script project
2. Replace the `doPost` function with the code above
3. Add the `doGet` function (this allows GET requests as fallback)
4. Click **Save**
5. Go to **Deploy** → **Manage deployments**
6. Click the pencil icon (edit) on your existing deployment
7. Under "Version", select **New version**
8. Click **Deploy**

## Verify Settings:

1. Make sure "Who has access" is set to **Anyone**
2. Make sure "Execute as" is set to **Me**
3. The deployment should be active

After updating, the form should work on both localhost and Vercel.

