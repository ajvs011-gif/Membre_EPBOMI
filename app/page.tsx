'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { estConnecte } from '@/lib/api';

export default function PageAccueil() {
  const router = useRouter();

  useEffect(() => {
    router.replace(estConnecte() ? '/membres' : '/connexion');
  }, [router]);

  return null;
}
