- [x] Task 1: Create root frame with balance check prompt  
  File: app/frames/index.tsx  
  Action: Create  
  Description: Implement base frame with balance check UI elements  
  Code:  
  ```typescript
  import { createFrames } from 'frames.js/next';

  export const POST = createFrames({
    basePath: '/',
  })(async (ctx) => {
    return {
      image: (
        <div style={{ color: 'white', backgroundColor: 'black', padding: 20 }}>
          Check your Base network token balance
        </div>
      ),
      buttons: [
        {
          action: 'post',
          label: 'Check Balance',
          target: '/balance',
        },
      ],
    };
  });
  ```  
  UI Components: Text prompt image, "Check Balance" button  
  Completion: Frame renders with image and button that navigates to /balance (404 expected)

- [x] Task 2: Implement balance check endpoint and API client  
  File: app/frames/balance/route.ts  
  Action: Create  
  Description: Create POST endpoint for balance checks  
  Code:  
  ```typescript
  import { createFrames } from 'frames.js/next';
  import { getBalances } from '../../../lib/degen';

  export const POST = createFrames()(async (ctx) => {
    const fid = ctx.message?.requesterFid;
    if (!fid) return { image: <div>Missing FID</div> };

    const balances = await getBalances(fid);
    return {
      image: <div>Balance: {balances.tokenBalance} [TOKEN]</div>,
    };
  });
  ```  
  API Endpoint: POST /balance  

  File: lib/degen.ts  
  Action: Create  
  Description: Create Degen API client with token address  
  Code:  
  ```typescript
  const TOKEN_ADDRESS = '0x4ed...fed'; // Full contract address

  export async function getBalances(fid: number) {
    const response = await fetch(
      `https://api.degen.tokens/balances?fid=${fid}`
    );
    return response.json();
  }
  ```  
  Completion: Balance endpoint returns numeric value with placeholder

- [x] Task 3: Add wallet linkage and token presence checks  
  File: app/frames/balance/route.ts  
  Action: Modify  
  Description: Handle empty addresses and missing token balances  
  Code Additions:  
  ```typescript
  if (!balances.address_balances?.length) {
    return { image: <div>No Base wallet detected</div> };
  }
  
  const tokenBalance = balances.address_balances[0].tokens[TOKEN_ADDRESS] || 0;
  ```  
  UI Components: "No Base wallet" and "0 [TOKEN]" displays  
  Completion: Proper messages show for unlinked wallets/missing tokens

- [ ] Task 4: Implement API authentication  
  File: lib/degen.ts  
  Action: Modify  
  Description: Add authorization header for API calls  
  Code Modification:  
  ```typescript
  headers: {
    'Authorization': `Bearer ${process.env.DEGEN_API_KEY}`
  }
  ```  
  Completion: API requests succeed with valid key in Postman

- [ ] Task 5: Format numeric balance display  
  File: app/frames/balance/route.ts  
  Action: Modify  
  Description: Apply decimal formatting and symbol replacement  
  Code Update:  
  ```typescript
  const formatted = (tokenBalance / 100).toFixed(2);
  return {
    image: <div>{formatted} DEGEN</div>,
    buttons: [/* existing buttons */]
  };
  ```  
  UI Components: Formatted balance display  
  Completion: Shows values like "12.50 DEGEN"

- [ ] Task 6: Implement comprehensive error states  
  File: app/frames/balance/route.ts  
  Action: Modify  
  Description: Add error handling and retry mechanism  
  Code Additions:  
  ```typescript
  try {
    // Existing balance logic
  } catch (error) {
    return {
      image: <div>Service unavailable</div>,
      buttons: [{
        action: 'post',
        label: 'Try Again',
        target: '/',
      }]
    };
  }
  ```  
  UI Components: Error message display, "Try Again" button  
  Completion: All error cases show consistent messaging with working reset flow
