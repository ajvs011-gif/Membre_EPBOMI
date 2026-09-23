'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, UserPlus, LogOut } from 'lucide-react';
import { supprimerJeton } from '@/lib/api';

const liens = [
  { href: '/membres', label: 'Membres', Icone: Users },
  { href: '/membres/nouveau', label: 'Ajouter', Icone: UserPlus },
];

export default function BarreNavigationBasse() {
  const chemin = usePathname();
  const router = useRouter();

  function seDeconnecter() {
    supprimerJeton();
    router.push('/connexion');
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-filet bg-papier
                 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-2xl">
        {liens.map(({ href, label, Icone }) => {
          const actif = chemin === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors
                ${actif ? 'text-encre' : 'text-encre-pale'}`}
            >
              <Icone size={19} strokeWidth={actif ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={seDeconnecter}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-encre-pale"
        >
          <LogOut size={19} strokeWidth={1.75} />
          Quitter
        </button>
      </div>
    </nav>
  );
}
