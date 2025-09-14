#!/bin/bash

echo "Testing API endpoints..."

# Test dashboard stats
echo -e "\n1. Testing Dashboard Stats:"
curl -s "http://localhost:8000/api/dashboard/stats/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf" | python3 -m json.tool | head -20

# Test activity timeline
echo -e "\n2. Testing Activity Timeline:"
curl -s "http://localhost:8000/api/dashboard/activity-timeline/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf&days=7" | python3 -m json.tool | head -20

# Test random events
echo -e "\n3. Testing Random Events:"
curl -s "http://localhost:8000/api/events/random/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf&account_id=account_31crr1tcp2bmcv1fk6pcm0k6ag" | python3 -m json.tool | head -30

# Test random people
echo -e "\n4. Testing Random People:"
curl -s "http://localhost:8000/api/people/random/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf" | python3 -m json.tool | head -30

echo -e "\nAPI tests complete!"