'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function IncidentsCTA() {
  const router = useRouter();

  const handleClick = () => {
    const isAuth = localStorage.getItem('podpulse_demo_auth') === 'true';
    router.push(isAuth ? '/incidents' : '/login');
  };

  return (
    <Button size="lg" onClick={handleClick}>
      Open incident command center
      <ArrowRight className="size-4" />
    </Button>
  );
}
