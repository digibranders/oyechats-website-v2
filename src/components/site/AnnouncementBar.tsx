import { Marquee } from '@/components/ds';
import { Sparkles, Zap, MessageSquare, Webhook } from 'lucide-react';

const ITEMS = [
  <span key="1" className="flex items-center gap-2"><Sparkles size={12} className="text-volt" /> Auto-recrawl keeps your knowledge base fresh</span>,
  <span key="2" className="flex items-center gap-2"><Zap size={12} className="text-volt" /> BANT scoring runs on every conversation</span>,
  <span key="3" className="flex items-center gap-2"><MessageSquare size={12} className="text-volt" /> Hand off to a human in the same thread</span>,
  <span key="4" className="flex items-center gap-2"><Webhook size={12} className="text-volt" /> 5 webhook event types, all signed</span>,
  <span key="5" className="flex items-center gap-2"><Sparkles size={12} className="text-volt" /> Any website, one script tag</span>,
  <span key="6" className="flex items-center gap-2"><Zap size={12} className="text-volt" /> Live on your site in minutes</span>,
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
