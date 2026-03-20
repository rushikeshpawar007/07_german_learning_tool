import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/shared/Button';

export function NotFoundPage() {
  return (
    <PageShell>
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist."
        action={<Link to="/"><Button>Go Home</Button></Link>}
      />
    </PageShell>
  );
}
