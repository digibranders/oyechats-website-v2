import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OyeChats. AI Chatbot with BANT Qualification',
    short_name: 'OyeChats',
    description:
      'AI chatbot that qualifies every visitor with BANT scoring, grounded in your docs, streamed in real time, before your sales reps ever see them.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#FAFAF7',
    icons: [
      { src: '/favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/favicon.png', sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
