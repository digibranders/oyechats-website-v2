import { Marquee } from '@/components/ds';
import { Sparkles, Zap, MessageSquare, Webhook } from 'lucide-react';

const ITEMS = [
  <span key="1" className="flex items-center gap-2"><Sparkles size={12} className="text-volt" /> Voltage Paper v1.0 shipped</span>,
  <span key="2" className="flex items-center gap-2"><Zap size={12} className="text-volt" /> BANT scoring is now real-time</span>,
  <span key="3" className="flex items-center gap-2"><MessageSquare size={12} className="text-volt" /> Live handoff across 5 channels</span>,
  <span key="4" className="flex items-center gap-2"><Webhook size={12} className="text-volt" /> 5 new webhook event types</span>,
  <span key="5" className="flex items-center gap-2"><Sparkles size={12} className="text-volt" /> Any site, one script tag</span>,
  <span key="6" className="flex items-center gap-2"><Zap size={12} className="text-volt" /> First qualified lead in &lt;10 min</span>,
];

export default function AnnouncementBar() {
  return (
    <div className="h-9 border-b border-line bg-canvas flex items-center overflow-hidden">
      <div className="max-w-[1360px] mx-auto w-full px-6 md:px-12">
        <Marquee items={ITEMS} speed={45} />
      </div>
    </div>
  );
}
