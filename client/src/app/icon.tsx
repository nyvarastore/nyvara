import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#1A1610', // Charcoal dark background
          color: '#C9A96E',      // Gold color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          fontFamily: 'serif',
          fontWeight: 600,
        }}
      >
        N
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
