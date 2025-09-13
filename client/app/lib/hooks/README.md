# API Hooks Documentation

This directory contains React hooks for fetching data from the Django backend API.

## Available Hooks

### `useActivityEvents`
Fetches activity events from the API.

**Usage:**
```typescript
import { useActivityEvents } from '@/lib/hooks';

const { data, loading, error, refetch } = useActivityEvents({
  customer_org_id: 'org_id',  // optional, uses default if not provided
  account_id: 'account_id',    // optional, uses default if not provided
  enabled: true                // optional, controls if hook should fetch
});
```

### `usePeople`
Fetches people/persons data from the API.

**Usage:**
```typescript
import { usePeople } from '@/lib/hooks';

const { data, loading, error, refetch } = usePeople({
  customer_org_id: 'org_id',  // optional, uses default if not provided
  enabled: true                // optional, controls if hook should fetch
});
```

### `useDashboardStats`
Fetches dashboard statistics including totals and breakdowns.

**Usage:**
```typescript
import { useDashboardStats } from '@/lib/hooks';

const { data, loading, error, refetch } = useDashboardStats({
  customer_org_id: 'org_id',  // optional, uses default if not provided
  days: 30,                    // optional, number of days to fetch (default: 30)
  enabled: true                // optional, controls if hook should fetch
});
```

### `useActivityTimeline`
Fetches activity timeline data for chart visualization.

**Usage:**
```typescript
import { useActivityTimeline } from '@/lib/hooks';

const { data, loading, error, refetch } = useActivityTimeline({
  customer_org_id: 'org_id',  // optional, uses default if not provided
  days: 30,                    // optional, number of days to fetch (default: 30)
  enabled: true                // optional, controls if hook should fetch
});
```

## Return Values

All hooks return an object with the following properties:

- `data`: The fetched data (null if not loaded yet)
- `loading`: Boolean indicating if the request is in progress
- `error`: Error object if the request failed (null otherwise)
- `refetch`: Function to manually trigger a new fetch

## Default Values

The hooks use default values from `/app/lib/api/config.ts`:
- `DEFAULT_CUSTOMER_ORG_ID`: 'org_4m6zyrass98vvtk3xh5kcwcmaf'
- `DEFAULT_ACCOUNT_ID`: 'account_31crr1tcp2bmcv1fk6pcm0k6ag'

## Error Handling

All hooks include built-in error handling:
- Network errors are caught and stored in the `error` state
- Console errors are logged for debugging
- Components can check the `error` state and display appropriate UI

## Example Component

```typescript
import React from 'react';
import { useActivityEvents, useDashboardStats } from '@/lib/hooks';

export function MyDashboard() {
  const { data: events, loading, error } = useActivityEvents();
  const { data: stats } = useDashboardStats({ days: 7 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Events: {stats?.total_events}</p>
      <ul>
        {events?.map(event => (
          <li key={event.id}>{event.activity}</li>
        ))}
      </ul>
    </div>
  );
}
```