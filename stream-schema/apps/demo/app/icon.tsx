import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#07070a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        border: '1px solid #1e1e28',
      }}
    >
      <div
        style={{
          color: '#a3ff4e',
          fontSize: 17,
          fontWeight: 800,
          fontFamily: 'monospace',
          lineHeight: 1,
          marginTop: 1,
        }}
      >
        {'{}'}
      </div>
    </div>,
    { ...size }
  );
}
