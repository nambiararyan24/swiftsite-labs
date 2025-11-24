export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET requests (for testing)
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Form submission API is ready. Use POST to submit forms.' });
  }

  // Only allow POST requests for actual submissions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxQHUlHAjOO-wshNxqayvPX-Q3rnPRv-b_7cfJYDB0c11az6PbUoGCJ6aKXX4X16HoZ/exec';

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('timestamp', timestamp || new Date().toISOString());

    // Submit to Google Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'follow'
    });

    // Google Apps Script may return HTML or text, so we check the status
    const responseText = await response.text();
    
    // Check if submission was successful (status 200 or 302 redirect is OK for Google Apps Script)
    if (response.ok || response.status === 200 || response.status === 302) {
      return res.status(200).json({ 
        success: true, 
        message: 'Form submitted successfully' 
      });
    } else {
      throw new Error(`Google Apps Script returned status: ${response.status}`);
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to submit form',
      message: error.message 
    });
  }
}

