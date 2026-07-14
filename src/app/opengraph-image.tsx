import { ImageResponse } from 'next/og';

export const alt = 'OyeChats — You only talk to buyers.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#FAFAF7';
const INK = '#1A1A1A';
const MAGENTA = '#A21CAF';

export default async function OpenGraphImage(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: PAPER,
          padding: '90px',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 34,
            fontWeight: 600,
            color: INK,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: MAGENTA }}>Oye</span>
          <span>Chats</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            You only talk to&nbsp;<span style={{ color: MAGENTA }}>buyers.</span>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 36,
              fontSize: 34,
              fontWeight: 400,
              color: '#4A4A4A',
              lineHeight: 1.3,
              maxWidth: 940,
            }}
          >
            OyeChats — AI chatbot that qualifies every visitor with BANT scoring.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            height: 10,
            width: 180,
            borderRadius: 9999,
            backgroundColor: MAGENTA,
          }}
        />
      </div>
    ),
    size,
  );
}
