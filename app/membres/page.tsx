'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { appelApi, estConnecte, ErreurApi } from '@/lib/api';
import BarreNavigationBasse from '@/components/BarreNavigationBasse';

interface Membre {
  id_membre: number;
  nom: string;
  prenoms: string;
  profession: string | null;
  email: string | null;
  date_naissance: string | null;
}

interface ReponseListe {
  page: number;
  limite: number;
  total: number;
  resultats: Membre[];
}

export default function PageMembres() {
  const router = useRouter();
  const [membres, setMembres] = useState<Membre[]>([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!estConnecte()) {
      router.push('/connexion');
      return;
    }
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function charger(termeRecherche = '') {
    setChargement(true);
    setErreur(null);
    try {
      const parametres = new URLSearchParams({ limite: '50' });
      if (termeRecherche) parametres.set('recherche', termeRecherche);
      const reponse = await appelApi<ReponseListe>(`/api/membres?${parametres.toString()}`);
      setMembres(reponse.resultats);
    } catch (err) {
      if (err instanceof ErreurApi && err.statut === 401) {
        router.push('/connexion');
        return;
      }
      setErreur(err instanceof ErreurApi ? err.message : 'Erreur de chargement');
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-serif text-2xl font-semibold text-encre">Membres</h1>
        {!chargement && <span className="text-xs text-encre-pale">{membres.length} affiché(s)</span>}
      </div>

      <div className="relative mb-6">
        <Search size={16} className="pointer-events-none absolute left-0.5 top-1/2 -translate-y-1/2 text-encre-pale" />
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && charger(recherche)}
          placeholder="Rechercher un nom..."
          className="w-full border-b border-filet bg-transparent py-2.5 pl-6 text-[15px] text-encre
                     placeholder:text-encre-pale/70 focus:border-laiton focus:outline-none"
        />
      </div>

      {erreur && (
        <p className="mb-4 rounded-md bg-alerte/10 px-3 py-2 text-sm text-alerte">{erreur}</p>
      )}

      {chargement ? (
        <p className="text-center text-sm text-encre-pale">Chargement...</p>
      ) : membres.length === 0 ? (
        <p className="text-center text-sm text-encre-pale">Aucun membre trouvé.</p>
      ) : (
        <ul className="divide-y divide-filet border-t border-filet">
          {membres.map((m) => (
            <li key={m.id_membre}>
              <Link
                href={`/membres/${m.id_membre}`}
                className="flex items-center justify-between gap-3 py-3.5 active:bg-papier-doux"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-encre">
                    {m.nom} {m.prenoms}
                  </p>
                  {m.profession && <p className="truncate text-[13px] text-encre-pale">{m.profession}</p>}
                </div>
                <ChevronRight size={16} className="shrink-0 text-encre-pale" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/membres/nouveau"
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full
                   bg-laiton text-papier shadow-lg shadow-laiton-fonce/20 active:scale-95"
        aria-label="Ajouter un membre"
      >
        <Plus size={24} strokeWidth={2.25} />
      </Link>

      <BarreNavigationBasse />
    </main>
  );
}
