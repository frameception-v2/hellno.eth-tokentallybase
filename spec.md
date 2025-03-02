### 1. Core Functionality  
**Main User Flow**:  
1. User opens Frame showing prompt to check token balance  
2. User clicks "Check Balance" button  
3. Frame retrieves user's Farcaster ID (FID) from context  
4. Backend queries Degen API for user's Base network balances  
5. Frame displays total balance of target ERC-20 token (0x4ed...fed)  

**Required API Endpoints**:  
- `GET /farcaster/user/balance` (Degen API)  
  - Parameters: `fid`, `networks=base`  

**Key Data Structures**:  
```typescript
type BalanceResponse = {
  address_balances: {
    verified_address: {
      network: 'base'
      address: string
    }
    token_balances: {
      token: {
        address: string
        decimals: number
      }
      balance: {
        in_token: string
      }
    }[]
  }[]
}
```

---

### 2. Implementation Approach  
**Frame Structure**:  
1. Initial Frame:  
   - Image: "Check your Base network token balance"  
   - Button: "Check Balance" (POST to /balance endpoint)  

2. Result Frame:  
   - Image: Displays formatted token balance or error message  
   - Button: "Try Again" (POST to initial endpoint)  

**API Integration Points**:  
```typescript
const fetchBalance = async (fid: number) => {
  const response = await fetch(
    `https://api.degen.tips/farcaster/user/balance?fid=${fid}&networks=base`
  )
  return response.json() as Promise<BalanceResponse>
}
```

**State Management**:  
- Stateless design leveraging Farcaster's message signing  
- Session data stored in Frame postback payload  

---

### 3. Technical Considerations  
**Authentication**:  
- Add API key if required by Degen API:  
  ```typescript
  headers: { 'Authorization': `Bearer ${process.env.DEGEN_API_KEY}` }
  ```

**Critical Error Scenarios**:  
1. Unlinked Base Wallet:  
   - "No Base wallet detected ➡️ Connect in Farcaster settings"  

2. API Failure:  
   - "Balance service unavailable 🛠️ Try again later"  

3. Token Not Found:  
   - "You hold 0 [TOKEN] on Base network"  

**Balance Calculation Logic**:  
```typescript
const calculateBalance = (response: BalanceResponse) => {
  return response.address_balances.reduce((total, addr) => {
    addr.token_balances.forEach(tb => {
      if (tb.token.address === TARGET_CONTRACT) {
        const value = parseFloat(tb.balance.in_token) / (10 ** tb.token.decimals)
        total += value
      }
    })
    return total
  }, 0)
}
```

---

### Suggested Frame Response Format  
```typescript
// pages/api/frame.ts
import { Frog } from 'frog'

const TARGET_CONTRACT = '0x4ed4e862860bed51a9570b96d89af5e1b0efefed'

export const app = new Frog()
  .frame('/', (c) => c.res({
    image: <BalancePrompt />,
    intents: [<Button action="/balance">Check Balance</Button>]
  }))
  .frame('/balance', async (c) => {
    try {
      const { fid } = c.var.interactor()
      const data = await fetchBalance(fid)
      const balance = calculateBalance(data)
      
      return c.res({
        image: <BalanceDisplay value={balance} />,
        intents: [<Button.Reset>Try Again</Button.Reset>]
      })
    } catch (error) {
      return c.res({
        image: <ErrorDisplay message="Service unavailable" />,
        intents: [<Button.Reset>Retry</Button.Reset>]
      })
    }
  })
```