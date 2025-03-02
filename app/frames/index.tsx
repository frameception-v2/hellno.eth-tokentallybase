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
