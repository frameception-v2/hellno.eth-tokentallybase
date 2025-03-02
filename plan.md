### Step 1: Create Initial Check Balance Frame
```text
- Build: Root route with image "Check your Base network token balance" and "Check Balance" button pointing to /balance endpoint
- Outcome: Frame displays correctly in testing with visible prompt and functional button (clicking leads to 404 until next step)
```

### Step 2: Implement Balance Check API Integration
```text
- Build: /balance endpoint fetching FID, calling Degen API, calculating balance using token 0x4ed...fed
- Outcome: Successful balance check shows raw numeric value with [TOKEN] placeholder. API errors show generic "Service unavailable" message
```

### Step 3: Handle Unlinked Wallet and Missing Token Cases
```text
- Build: Check for empty address_balances (unlinked wallet) and missing target token in balances
- Outcome: Shows "No Base wallet detected" for unlinked wallets and "0 [TOKEN]" when token not found
```

### Step 4: Add Degen API Authentication
```text
- Build: Add Authorization header with DEGEN_API_KEY environment variable if required by API
- Outcome: Successful API calls with valid key (test with Postman/curl before Frame integration verification)
```

### Step 5: Format Balance Display with Decimals and Token Symbol
```text
- Build: Format balance to 2 decimal places and replace [TOKEN] with actual symbol (e.g., DEGEN)
- Outcome: Displays "12.50 DEGEN" instead of raw numeric value with placeholder
```

### Step 6: Finalize Error Handling and User Feedback
```text
- Build: Test all error scenarios (API failure, rate limits, invalid FID) and verify UI feedback matches specs
- Outcome: Consistent error messages across all failure modes with functional "Try Again" button resetting the flow
```