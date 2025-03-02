export const TOKEN_ADDRESS = '0x4ed...fed'; // TODO: Replace with full contract address

export async function getBalances(fid: number) {
  const response = await fetch(
    `https://api.degen.tokens/balances?fid=${fid}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DEGEN_API_KEY}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Degen API error: ${response.status}`);
  }

  return response.json();
}
