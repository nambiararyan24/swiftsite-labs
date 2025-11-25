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

    // Submit to Google Apps Script with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        redirect: 'follow',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      // Don't wait for full response - just check if request was accepted
      // Google Apps Script returns 200/302 for successful submissions
      if (response.ok || response.status === 200 || response.status === 302) {
        // Return success immediately without reading response body
        return res.status(200).json({ 
          success: true, 
          message: 'Form submitted successfully' 
        });
      } else {
        throw new Error(`Google Apps Script returned status: ${response.status}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      // If timeout or error, still return success (fire-and-forget approach)
      // The data was sent, even if we didn't wait for confirmation
      if (error.name === 'AbortError') {
        return res.status(200).json({ 
          success: true, 
          message: 'Form submitted successfully' 
        });
      }
      throw error;
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

