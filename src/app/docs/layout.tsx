import type { ReactNode } from 'react';
import { Container } from '@/components/ds';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

/**
 * Shell for every `/docs` route: persistent navigation on the left, page
 * content on the right. The sidebar lives in the layout so it is not
 * re-rendered on navigation between docs pages.
 */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-canvas">
      <Container size="wide" className="py-10 md:py-14">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-12">
          <DocsSidebar />
          {/* min-w-0 is load-bearing: without it a wide code block or table
              inside a grid child expands the column instead of scrolling. */}
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </div>
  );
}
