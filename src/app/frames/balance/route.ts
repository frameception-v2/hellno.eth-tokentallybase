import { createFrames } from 'frames.js/next';
import { React } from 'react';
import { base } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  chain: base,
  transport: http(),
});

// ERC-20 ABI for balanceOf
const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

export const POST = createFrames()(async (ctx) => {
  try {
    const address = ctx.message?.requesterVerifiedAddresses?.[0];
    if (!address) return { image: <div>Connect wallet first</div> };

    const balance = await client.readContract({
      address: '0x4ed...fed', // Replace with actual token address
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    });

    const formatted = Number(balance) / 10**18; // Adjust decimals as needed

    return {
      image: (
        <div style={{ color: 'white', backgroundColor: 'black', padding: 20 }}>
          Balance: {formatted.toFixed(2)} TOKEN
        </div>
      ),
      buttons: [
        {
          action: 'post',
          label: 'Refresh',
          target: '/balance',
        },
      ],
    };
  } catch (error) {
    return {
      image: <div>Error fetching balance</div>,
      buttons: [
        {
          action: 'post',
          label: 'Retry',
          target: '/balance',
        },
      ],
    };
  }
});
