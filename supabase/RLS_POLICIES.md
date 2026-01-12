# Supabase Row Level Security (RLS) Policies for Memories Table

This document contains the SQL migration script for creating the `memories` table with Row Level Security (RLS) policies.

## Table Schema

The `memories` table stores user-generated memories with the following columns:

- `id` (UUID, Primary Key): Unique identifier for each memory
- `title` (TEXT): Title of the memory
- `category` (TEXT): Category of the memory ('Knowledge', 'Experience', 'Lesson', 'Mistake')
- `content` (TEXT): Full content of the memory
- `visibility` (TEXT): Visibility setting ('private' or 'public')
- `user_id` (UUID, Foreign Key): Reference to the user who created the memory (from `auth.users`)
- `timestamp` (BIGINT): Unix timestamp when the memory was created
- `date_added` (TEXT): Human-readable date string
- `created_at` (TIMESTAMP): Database timestamp for creation
- `updated_at` (TIMESTAMP): Database timestamp for last update

## Row Level Security Policies

### 1. SELECT Policies

#### Policy: "Anyone can read public memories"
- **Who**: Anyone (authenticated and anonymous users)
- **What**: Can SELECT memories where `visibility = 'public'`
- **Purpose**: Allow all users to view public memories

#### Policy: "Users can read their own private memories"
- **Who**: Authenticated users only
- **What**: Can SELECT memories where `visibility = 'private'` AND `user_id = auth.uid()`
- **Purpose**: Users can only view their own private memories

### 2. INSERT Policy

#### Policy: "Authenticated users can insert memories"
- **Who**: Authenticated users only
- **What**: Can INSERT memories, but must set `user_id = auth.uid()`
- **Purpose**: Only logged-in users can create memories, and they automatically own them

### 3. UPDATE Policy

#### Policy: "Users can update their own memories"
- **Who**: Authenticated users only
- **What**: Can UPDATE memories where `user_id = auth.uid()`
- **Purpose**: Users can only modify their own memories

### 4. DELETE Policy

#### Policy: "Users can delete their own memories"
- **Who**: Authenticated users only
- **What**: Can DELETE memories where `user_id = auth.uid()`
- **Purpose**: Users can only delete their own memories

## How to Apply

### Option 1: Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `supabase/migrations/001_create_memories_table.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're in the project root directory
supabase db push
```

Or if you prefer to apply a specific migration:

```bash
supabase migration up
```

## Security Notes

- ✅ RLS is enabled on the table, so all access is controlled by policies
- ✅ Anonymous users can only read public memories
- ✅ Users cannot create memories for other users (enforced by INSERT policy)
- ✅ Users cannot modify or delete other users' memories
- ✅ Foreign key constraint on `user_id` ensures referential integrity
- ✅ Cascade delete ensures memories are deleted when a user is deleted

## Testing the Policies

You can test the policies by:

1. **Testing anonymous access**:
   ```sql
   -- As anonymous user (using anon key)
   SELECT * FROM memories WHERE visibility = 'public'; -- Should work
   SELECT * FROM memories WHERE visibility = 'private'; -- Should return empty
   ```

2. **Testing authenticated access**:
   ```sql
   -- As authenticated user (using authenticated JWT)
   SELECT * FROM memories WHERE visibility = 'public'; -- Should work
   SELECT * FROM memories WHERE user_id = auth.uid() AND visibility = 'private'; -- Should work
   ```

3. **Testing INSERT**:
   ```sql
   -- Only works if authenticated and user_id matches auth.uid()
   INSERT INTO memories (title, category, content, visibility, user_id, timestamp, date_added)
   VALUES ('Test', 'Knowledge', 'Content', 'private', auth.uid(), EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, '2024-01-01');
   ```

4. **Testing UPDATE/DELETE**:
   ```sql
   -- Only works if user_id matches auth.uid()
   UPDATE memories SET title = 'Updated' WHERE id = 'memory-id' AND user_id = auth.uid();
   DELETE FROM memories WHERE id = 'memory-id' AND user_id = auth.uid();
   ```

## Indexes

The migration creates several indexes for performance:

- `idx_memories_user_id`: Fast lookups by user
- `idx_memories_visibility`: Fast filtering by visibility
- `idx_memories_timestamp`: Fast sorting by timestamp (descending)

## Automatic Timestamps

The table includes:
- `created_at`: Automatically set on INSERT
- `updated_at`: Automatically updated via trigger on UPDATE

These timestamps help with auditing and can be useful for sorting or filtering.
