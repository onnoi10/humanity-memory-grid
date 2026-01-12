# Migration from localStorage to Supabase

This document explains the migration from browser localStorage to Supabase database for persistent storage across users, browsers, and sessions.

## Changes Made

### 1. Database Schema Updates

- **Added `author_email` column** to the `memories` table to support author attribution for public memories
- Updated migration file: `supabase/migrations/001_create_memories_table.sql`
- Created additional migration: `supabase/migrations/002_add_author_email.sql` for existing databases

### 2. Storage Layer Refactoring

**File: `src/utils/storage.ts`**

- **Removed**: localStorage-based storage
- **Added**: Supabase database integration
- All functions are now `async`:
  - `loadMemories()` - Fetches memories from Supabase (RLS policies handle filtering)
  - `addMemory()` - Inserts new memory into Supabase database
  - `exportMemories()` - Exports memories fetched from Supabase

### 3. Component Updates

**Files Updated:**
- `src/pages/Memories.tsx` - Updated to handle async `loadMemories()`
- `src/pages/AddMemory.tsx` - Updated to handle async `addMemory()` with error handling

## How Persistence Works

### Public Memories
- ✅ **Persist across users**: Stored in Supabase database, accessible to all users
- ✅ **Persist across browsers**: Database is browser-independent
- ✅ **Persist across sessions**: Data remains in database after logout/login
- ✅ **Visible to everyone**: RLS Policy allows anonymous and authenticated users to read public memories

### Private Memories
- ✅ **Only visible to owner**: RLS Policy ensures only the creator can read their private memories
- ✅ **Persist across sessions**: Stored in database, accessible when user logs back in
- ✅ **Persist across browsers**: User can access their private memories from any browser after logging in
- ✅ **Secure**: RLS policies prevent other users from accessing private memories

## Row Level Security (RLS) Policies

The following RLS policies ensure proper access control:

1. **"Anyone can read public memories"**
   - Allows anonymous and authenticated users to read memories where `visibility = 'public'`
   - Enables public memories to be visible to everyone

2. **"Users can read their own private memories"**
   - Allows authenticated users to read memories where `visibility = 'private'` AND `user_id = auth.uid()`
   - Ensures private memories are only visible to their owner

3. **"Authenticated users can insert memories"**
   - Requires authentication to create memories
   - Ensures `user_id` matches the authenticated user's ID

4. **"Users can update their own memories"**
   - Only allows users to update their own memories

5. **"Users can delete their own memories"**
   - Only allows users to delete their own memories

## Migration Steps

### For New Installations

1. Run the SQL migration in Supabase SQL Editor:
   ```sql
   -- Run: supabase/migrations/001_create_memories_table.sql
   ```

### For Existing Installations

1. Run both migrations in order:
   ```sql
   -- First: supabase/migrations/001_create_memories_table.sql
   -- Then: supabase/migrations/002_add_author_email.sql
   ```

2. **Optional**: Migrate existing localStorage data to Supabase:
   - Export memories from localStorage (if any exist)
   - Import them into Supabase using the Supabase dashboard or a migration script

## Benefits

1. **True Persistence**: Memories are stored in a centralized database, not browser storage
2. **Cross-Device Access**: Users can access their memories from any device/browser
3. **Data Security**: RLS policies enforce access control at the database level
4. **Scalability**: Database can handle large numbers of memories and users
5. **Backup & Recovery**: Database backups ensure data isn't lost

## Testing

To verify the implementation:

1. **Test Public Memory Persistence**:
   - Create a public memory as User A
   - Log out and log in as User B (or use incognito/anonymous)
   - Verify the public memory is visible

2. **Test Private Memory Security**:
   - Create a private memory as User A
   - Log out and log in as User B
   - Verify the private memory is NOT visible to User B
   - Log back in as User A
   - Verify the private memory is visible

3. **Test Cross-Browser Persistence**:
   - Create memories in Browser A
   - Open the app in Browser B (or different device)
   - Verify public memories are visible
   - Log in and verify private memories are visible

## Error Handling

The implementation includes error handling:
- Network errors are caught and logged
- Authentication errors redirect to login
- Database errors are logged to console
- User-facing error messages can be added to the UI as needed

## Notes

- The `transformDbRowToMemory()` and `transformMemoryToDbRow()` helper functions handle the conversion between database schema (snake_case) and TypeScript interface (camelCase)
- All database operations respect RLS policies automatically
- No client-side filtering is needed for private memories - RLS handles it at the database level
