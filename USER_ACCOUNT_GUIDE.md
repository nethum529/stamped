# 👤 User Account Management Guide

## ✅ What's Now Available

Your app now has complete user account management with:
- ✅ Sign out functionality
- ✅ Profile picture upload
- ✅ Profile editing
- ✅ Password change
- ✅ Notification preferences

## 🚪 How to Sign Out

### Option 1: From Navigation Sidebar
1. Click the **"Sign out"** button at the bottom of the left sidebar
2. You'll be redirected to the login page
3. Your session will be cleared

### Option 2: From Settings Page
1. Go to **Settings** → **Security** section
2. Click the **"Sign Out"** button
3. Same effect as Option 1

## 🖼️ How to Update Profile Picture

1. Go to `/settings` or click **Settings** in the sidebar
2. In the **Profile** card, you'll see your current avatar (or a default icon)
3. Click **"Upload Photo"** button
4. Select an image file (JPG, PNG, or GIF)
5. Maximum file size: 5MB
6. The image uploads to Supabase Storage
7. Your profile picture updates instantly!

### To Remove Profile Picture
- Hover over your current profile picture
- Click the **X** button that appears
- Or click the **"Remove"** button next to Upload

## ✏️ How to Edit Profile

### Update Name
1. Go to `/settings`
2. In the **Profile** section, edit the **Full Name** field
3. Click **"Save Changes"**
4. Your name updates across the app

### Email
- Email is **read-only** for security
- Shows your current email address
- To change email, contact support

## 🔐 How to Change Password

1. Go to `/settings`
2. Scroll to the **Security** card
3. Enter your **New Password** (minimum 8 characters)
4. Enter **Confirm New Password**
5. Click **"Change Password"**
6. You'll get a success message!

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain a number

## 🔔 Notification Preferences

1. Go to `/settings`
2. Find the **Notifications** card
3. Toggle checkboxes for:
   - High risk alerts
   - Document uploads
   - Approval requests  
   - Weekly reports
4. Changes save automatically

## 🗂️ Where Profile Data is Stored

### Supabase Auth
- Email address
- Password (hashed)
- User metadata (name, avatar URL)

### Supabase Storage
- Profile pictures stored in `avatars/` bucket
- Public URLs generated automatically
- Old images replaced when uploading new ones

## 🎨 How It Works

### Sign Out Flow
```typescript
import { authService } from '@/lib/auth/service'

// Sign out
await authService.signOut()
// Clears session cookies
// Redirects to /login
```

### Profile Picture Upload Flow
1. User selects image file
2. Validate file (size, type)
3. Upload to Supabase Storage bucket: `avatars`
4. Get public URL
5. Update user metadata with avatar URL
6. Display new image instantly

### Profile Update Flow
1. User edits name
2. Submit form
3. Call `supabase.auth.updateUser()`
4. Update user metadata
5. Refresh user data
6. Show success message

## 🛠️ Technical Details

### Authentication Service
```typescript
// Get current user
const user = await authService.getUser()

// Sign out
await authService.signOut()

// Update password
await authService.updatePassword(newPassword)
```

### Supabase Storage
```typescript
// Upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filePath, file, { upsert: true })

// Get public URL
const { data: urlData } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath)
```

### Update User Metadata
```typescript
const { error } = await supabase.auth.updateUser({
  data: {
    full_name: name,
    avatar_url: imageUrl,
  }
})
```

## 📝 Next Steps

### Additional Features You Could Add

1. **Email Change** - Add email update with verification
2. **2FA** - Two-factor authentication
3. **Session Management** - View and revoke active sessions
4. **Account Deletion** - Allow users to delete their account
5. **Activity Log** - Show recent account activity
6. **Privacy Settings** - Control what data is shared
7. **Connected Accounts** - Link social accounts (Google, GitHub, etc.)
8. **Download Data** - Export all user data (GDPR compliance)

### Storage Bucket Setup

**Important:** You need to create the `avatars` bucket in Supabase:

1. Go to your Supabase dashboard
2. Navigate to **Storage**
3. Click **"New bucket"**
4. Name it: `avatars`
5. Make it **Public** (so avatar images can be displayed)
6. Set policies:
   ```sql
   -- Allow authenticated users to upload their own avatars
   CREATE POLICY "Users can upload their own avatar"
   ON storage.objects FOR INSERT
   WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow authenticated users to update their own avatars
   CREATE POLICY "Users can update their own avatar"
   ON storage.objects FOR UPDATE
   USING (auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow public read access to avatars
   CREATE POLICY "Public read access to avatars"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'avatars');
   ```

## 🎯 User Experience

### Success Messages
- ✅ "Profile updated successfully!"
- ✅ "Profile picture updated!"
- ✅ "Profile picture removed"
- ✅ "Password updated successfully!"

### Error Handling
- Image too large (>5MB)
- Invalid file type (not an image)
- Network errors
- Supabase errors
- Password mismatch
- Weak passwords

### Loading States
- Upload progress indicator
- Form submission loading
- Disabled buttons during operations

## 🔒 Security Considerations

1. **File Validation** - Size and type checked before upload
2. **Unique Filenames** - Prevents collisions: `{userId}-{timestamp}.{ext}`
3. **Secure URLs** - Public URLs only for avatars bucket
4. **Password Requirements** - Enforced on client and server
5. **Session Management** - Cookies are HTTP-only and secure
6. **No Email Change** - Requires additional verification flow

## 📱 Mobile Responsive

All account management features work perfectly on mobile:
- Touch-friendly buttons
- Responsive layout
- File upload works on mobile browsers
- Camera access on mobile devices

---

Your account management is now fully functional! 🎉

