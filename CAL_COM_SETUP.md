# Cal.com Setup Guide

This guide will help you set up Cal.com for the booking widget on your website's contact section.

## Step 1: Create a Cal.com Account

1. Go to [cal.com](https://cal.com)
2. Click **"Sign Up"** or **"Get Started"**
3. Choose one of the following sign-up methods:
   - Sign up with Google
   - Sign up with email
   - Sign up with GitHub
4. Complete the registration process

## Step 2: Set Up Your Profile

1. After signing up, you'll be prompted to set up your profile
2. Enter your name and email address
3. Choose a username (this will be part of your booking URL)
   - Example: If you choose `swiftsitelabs`, your booking URL will be `cal.com/swiftsitelabs`
4. Complete the initial setup

## Step 3: Create an Event Type

1. Once logged in, click on **"Event Types"** in the left sidebar
2. Click **"+ New"** or **"Add Event Type"**
3. Fill in the event details:
   - **Title**: e.g., "30min Meeting", "Consultation Call", "Discovery Call"
   - **Duration**: Choose how long the meeting should be (15min, 30min, 60min, etc.)
   - **Description**: Add a brief description of what the meeting is about
   - **Location**: Choose "Cal.com Video" for online meetings, or add a physical location
4. Click **"Continue"** or **"Save"**

## Step 4: Configure Availability

1. Set your availability:
   - Click on **"Availability"** in the left sidebar
   - Set your working hours for each day of the week
   - Set your timezone
   - Add any blocked time slots if needed
2. You can also set availability for specific event types

## Step 5: Get Your Booking Link

1. Go back to **"Event Types"**
2. Click on the event type you created
3. You'll see your booking link in this format:
   - `https://cal.com/yourusername/eventname`
   - Example: `https://cal.com/swiftsitelabs/30min`

## Step 6: Update Your Website

1. Open `index.html` in your project
2. Find the Cal.com iframe (around line 495-500)
3. Replace the `src` URL with your actual Cal.com booking link

### Current Code:
```html
<iframe 
    src="https://cal.com/swiftsitelabs/30min" 
    style="width:100%;height:100%;border:0;border-radius:8px" 
    frameborder="0"
    title="Book a call with SwiftSite Labs">
</iframe>
```

### Updated Code (replace with your link):
```html
<iframe 
    src="https://cal.com/YOUR_USERNAME/YOUR_EVENT_NAME" 
    style="width:100%;height:100%;border:0;border-radius:8px" 
    frameborder="0"
    title="Book a call with SwiftSite Labs">
</iframe>
```

**Example:**
If your username is `swiftsitelabs` and your event is named `consultation`, the URL would be:
```html
src="https://cal.com/swiftsitelabs/consultation"
```

## Step 7: Test Your Booking Widget

1. Save the changes to `index.html`
2. Open your website in a browser
3. Navigate to the Contact section
4. You should see the Cal.com booking widget
5. Try booking a test meeting to ensure everything works

## Additional Cal.com Features (Optional)

### Customize Your Booking Page
- Go to **"Appearance"** in Cal.com settings
- Customize colors, logo, and branding to match your website
- Add your company logo and brand colors

### Add Multiple Event Types
- Create different event types for different purposes:
  - Quick 15-minute intro call
  - 30-minute consultation
  - 60-minute strategy session
- You can embed multiple booking widgets or create a single link that shows all options

### Set Up Notifications
- Go to **"Settings"** > **"Notifications"**
- Configure email notifications for:
  - New bookings
  - Cancellations
  - Reminders

### Connect Your Calendar
- Go to **"Connected Calendars"**
- Connect your Google Calendar, Outlook, or other calendar
- This prevents double-booking and automatically blocks your calendar

## Troubleshooting

### If the widget doesn't appear:
1. Check that the URL in the iframe is correct
2. Make sure your Cal.com account is active
3. Verify the event type is published (not in draft mode)
4. Check browser console for any errors

### If bookings aren't working:
1. Ensure your availability is set correctly
2. Check that your calendar is connected
3. Verify your timezone settings
4. Make sure the event type is active

## Need Help?

- Cal.com Documentation: https://cal.com/docs
- Cal.com Support: Available in your Cal.com dashboard
- Community: https://cal.com/community

---

**Quick Checklist:**
- [ ] Created Cal.com account
- [ ] Set up profile and username
- [ ] Created at least one event type
- [ ] Configured availability
- [ ] Got the booking link
- [ ] Updated the iframe URL in index.html
- [ ] Tested the booking widget on your website

