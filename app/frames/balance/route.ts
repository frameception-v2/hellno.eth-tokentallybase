import { createFrames } from 'frames.js/next';
import React from "react";
import { getBalances } from '../../../lib/degen';

export const POST = createFrames()(async (ctx) => {
  const fid = ctx.message?.requesterFid;
  if (!fid) return { image: <div>Missing FID</div> } as any;

  const balances = await getBalances(fid);
  
  // Check for connected wallet
  if (!balances.address_balances?.length) {
    return { 
      image: (
        <div style={{ color: 'white', backgroundColor: 'black', padding: 20 }}>
          No Base wallet detected
        </div>
      )
    } as any;
  }

  // Get balance for our token from first connected wallet
  const tokenBalance = balances.address_balances[0].tokens[TOKEN_ADDRESS] || 0;

  return {
    image: (
      <div style={{ color: 'white', backgroundColor: 'black', padding: 20 }}>
        Balance: {tokenBalance} DEGEN
      </div>
    ),
  };
});
