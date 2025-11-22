# 🔥 Firebase Google Authentication Setup Guide

## 📋 Prerequisites
- A Google account
- Your GOALHUB application

---

## 🚀 Step-by-Step Setup

### **Step 1: Create a Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `GOALHUB` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional) or configure it
6. Click **Create project**
7. Wait for project creation, then click **Continue**

---

### **Step 2: Register Your Web App**

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `GOALHUB Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **Register app**
5. You'll see your Firebase configuration object - **COPY THIS!**

It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

### **Step 3: Enable Google Sign-In**

1. In Firebase Console, go to **Authentication** from the left sidebar
2. Click **Get started** (if first time)
3. Go to the **Sign-in method** tab
4. Click on **Google** in the provider list
5. Toggle **Enable** to ON
6. Select a **Project support email** (your email)
7. Click **Save**

---

### **Step 4: Configure Your Application**

1. Open `src/firebase.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

---

### **Step 5: Add Authorized Domains**

1. In Firebase Console, go to **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add your development domain:
   - `localhost` (should already be there)
4. For production, add:
   - Your production domain (e.g., `goalhub.ke`)

---

### **Step 6: Test the Integration**

1. Start your development server:
```bash
npm run dev
```

2. Start your backend server:
```bash
node server.js
```

3. Navigate to `http://localhost:5173`
4. Click **"Log In"**
5. Click **"Continue with Google"**
6. Select your Google account
7. You should be logged in! 🎉

---

## 🔒 Security Best Practices

### **1. Environment Variables (Recommended for Production)**

Instead of hardcoding your Firebase config, use environment variables:

1. Create a `.env` file in your project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

3. Add `.env` to your `.gitignore`:
```
.env
.env.local
```

### **2. Firebase Security Rules**

Set up proper Firestore/Storage rules in Firebase Console if you expand functionality.

---

## 🎨 What's Implemented

✅ **Google Sign-In Button** - Beautiful, branded button on login page
✅ **User Profile Integration** - Syncs Google account data (name, email, photo)
✅ **Automatic Login** - Seamless authentication flow
✅ **Sign Out** - Properly logs out from Google account
✅ **Error Handling** - Graceful failure messages
✅ **Notifications** - Success/failure feedback to users

---

## 🐛 Troubleshooting

### **Error: "Firebase: Error (auth/configuration-not-found)"**
- **Solution**: Make sure you've replaced the placeholder config in `src/firebase.js` with your actual Firebase credentials.

### **Error: "This domain is not authorized"**
- **Solution**: Add your domain to **Authorized domains** in Firebase Console → Authentication → Settings.

### **Google Sign-In popup blocked**
- **Solution**: Allow popups in your browser settings for `localhost`.

### **"Failed to load Firebase config"**
- **Solution**: Check that Firebase SDK is properly installed (`npm install firebase`).

### **Sign-In works but no user data**
- **Solution**: Check browser console for errors. Ensure Firebase Authentication is enabled.

---

## 📱 Features Overview

### **Login Page**
- Google Sign-In button with official Google branding
- Fallback email/password login
- Elegant divider design
- Responsive layout

### **User Profile**
- Automatically populated with Google account data:
  - Name
  - Email
  - Profile photo
- Persistent across sessions

### **Sign Out**
- Logs out from both app and Google account
- Returns user to landing page

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add Email/Password Authentication**
   - Enable Email/Password in Firebase Console
   - Implement signup/login forms

2. **Add Phone Authentication**
   - Enable Phone in Firebase Console
   - Implement SMS OTP flow

3. **Add Facebook/Twitter/GitHub Login**
   - Enable providers in Firebase Console
   - Add respective buttons and handlers

4. **Implement Persistent Authentication**
   - Use `onAuthStateChanged` to maintain login state
   - Auto-login on page refresh

5. **Add User Database**
   - Store user bookings in Firestore
   - Sync booking history with user account

---

## 📞 Support

If you encounter any issues:
1. Check Firebase Console for error logs
2. Check browser console for JavaScript errors
3. Verify all Firebase configuration values are correct
4. Ensure Firebase Authentication is enabled

---

## ✨ Success Checklist

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Firebase config added to `src/firebase.js`
- [ ] Authorized domains configured
- [ ] Successfully logged in with Google account
- [ ] User profile displays Google account info
- [ ] Sign out works correctly

---

**Congratulations! 🎉 Google Authentication is now fully integrated with GOALHUB!**

