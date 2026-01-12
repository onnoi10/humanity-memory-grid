# Supabase Setup Guide

This guide will help you connect your Humanity Memory Grid website to Supabase.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign in" if you already have an account
3. Sign up or log in with your GitHub account (recommended) or email
4. Once logged in, click "New Project"
5. Fill in the project details:
   - **Name**: e.g., "humanity-memory-grid"
   - **Database Password**: Create a strong password (save this - you'll need it for database access)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Select the free tier (you can upgrade later)
6. Click "Create new project"
7. Wait 1-2 minutes for your project to be provisioned

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, select your project
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **API** under Project Settings
4. You'll see two important values:
   - **Project URL**: Copy this (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key: Copy this (a long string starting with `eyJ...`)

## Step 3: Create Environment Variables File

1. In your project root directory, create a file named `.env`
2. Add the following content:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` with your Project URL
4. Replace `your_anon_key_here` with your anon public key
5. Save the file

**Important**: The `.env` file is already in `.gitignore`, so it won't be committed to git. This keeps your credentials secure.

## Step 4: Configure Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** (left sidebar)
2. Click on **Providers** 
3. Make sure **Email** provider is enabled (it should be by default)
4. Configure email settings (optional but recommended):
   - Go to **Authentication > Email Templates**
   - Customize the confirmation and password reset email templates if desired

## Step 5: Test Your Connection

1. In your terminal, make sure you're in your project directory
2. Install dependencies if you haven't already:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)
5. Click on "Login" in the navigation
6. Try signing up with a test email
7. Check your email for the confirmation link (if email confirmation is enabled)
8. Try signing in with your credentials

## Troubleshooting

### Error: "Invalid API key"
- Make sure you copied the **anon public** key, not the service_role key
- Check that there are no extra spaces in your `.env` file
- Restart your development server after creating/updating `.env`

### Error: "Failed to fetch" or Network errors
- Verify your `VITE_SUPABASE_URL` is correct
- Check that your Supabase project is active (not paused)
- Ensure your internet connection is working

### Authentication not working
- Check the Supabase dashboard > Authentication > Providers to ensure Email is enabled
- Verify you've confirmed your email (if email confirmation is required)
- Check the browser console for detailed error messages

## For Production Deployment

When deploying to production (e.g., GitHub Pages, Vercel, Netlify):

1. **For Vercel/Netlify**: Add environment variables in your platform's dashboard:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Environment Variables

2. **For GitHub Pages**: 
   - Since GitHub Pages serves static files, you'll need to set environment variables during build
   - Use GitHub Actions secrets for CI/CD
   - Note: Be careful not to expose your keys in client-side code

## Security Notes

- ⚠️ Never commit your `.env` file to git
- ⚠️ The `anon` key is safe to use in client-side code (it has Row Level Security)
- ⚠️ Never expose your `service_role` key in client-side code
- ✅ The `.env` file is already in `.gitignore` for security

## Next Steps

Once connected, you can:
- Use authentication to protect routes
- Store user data in Supabase tables
- Set up Row Level Security (RLS) policies
- Use Supabase Storage for file uploads
- Create database tables for your memories

For more information, visit the [Supabase Documentation](https://supabase.com/docs).