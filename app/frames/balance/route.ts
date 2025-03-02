import { createFrames } from 'frames.js/next';
import { getBalances } from '../../../lib/degen';

export const POST = createFrames()(async (ctx) => {
  const fid = ctx.message?.requesterFid;
  if (!fid) return { image: <div>Missing FID</div> };

  const balances = await getBalances(fid);
  
  return {
    image: (
      <div style={{ color: 'white', backgroundColor: 'black', padding: 20 }}>
        Balance: {balances.tokenBalance} [TOKEN]
      </div>
    )
  };
});
