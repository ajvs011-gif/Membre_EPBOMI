'use client';

import { useEffect, useRef, useState } from 'react';

export interface OptionRecherche {
  id: string;
  libelle: string;
  sousTitre?: string;
}

export function RechercheSelect({
  label,
  requis = false,
  placeholder = 'Tapez pour rechercher...',
  valeurAffichee,
  onSelectionner,
  onEffacer,
  rechercher,
  erreur,
  texteVide = 'Aucun résultat.',
  delaiDebounceMs = 300,
}: {
  label: string;
  requis?: boolean;
  placeholder?: string;
  /** Texte affiche quand une option est deja selectionnee (nom, pas ID) */
  valeurAffichee: string;
  onSelectionner: (option: OptionRecherche) => void;
  onEffacer: () => void;
  /** Fonction de recherche : locale (filtre en memoire) ou distante (appel API) */
  rechercher: (terme: string) => Promise<OptionRecherche[]>;
  erreur?: string;
  texteVide?: string;
  delaiDebounceMs?: number;
}) {
  const [terme, setTerme] = useState('');
  const [ouvert, setOuvert] = useState(false);
  const [resultats, setResultats] = useState<OptionRecherche[]>([]);
  const [chargement, setChargement] = useState(false);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const minuteurRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    function surClicExterieur(e: MouseEvent) {
      if (conteneurRef.current && !conteneurRef.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    document.addEventListener('mousedown', surClicExterieur);
    return () => document.removeEventListener('mousedown', surClicExterieur);
  }, []);

  function surSaisie(valeur: string) {
    setTerme(valeur);
    setOuvert(true);
    if (minuteurRef.current) clearTimeout(minuteurRef.current);
    minuteurRef.current = setTimeout(async () => {
      setChargement(true);
      try {
        const r = await rechercher(valeur);
        setResultats(r);
      } finally {
        setChargement(false);
      }
    }, delaiDebounceMs);
  }

  function surFocus() {
    setOuvert(true);
    if (resultats.length === 0 && terme === '') {
      // Precharge la liste (utile pour les petites listes comme les Eglises de Maison)
      surSaisie('');
    }
  }

  function selectionner(option: OptionRecherche) {
    onSelectionner(option);
    setTerme('');
    setResultats([]);
    setOuvert(false);
  }

  return (
    <div ref={conteneurRef} className="relative">
      <label className="mb-1.5 block text-[13px] font-medium text-encre-douce">
        {label}
        {requis && <span className="text-laiton-fonce"> *</span>}
      </label>

      {valeurAffichee ? (
        <div className={`flex items-center justify-between border-b py-2.5 ${erreur ? 'border-alerte' : 'border-filet'}`}>
          <span className="truncate text-[15px] text-encre">{valeurAffichee}</span>
          <button
            type="button"
            onClick={onEffacer}
            className="ml-2 shrink-0 text-xs font-medium text-encre-pale hover:text-laiton-fonce"
          >
            Changer
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={terme}
          placeholder={placeholder}
          onChange={(e) => surSaisie(e.target.value)}
          onFocus={surFocus}
          className={`w-full border-b bg-transparent px-0.5 py-2.5 text-[15px] text-encre placeholder:text-encre-pale/60
            focus:outline-none ${erreur ? 'border-alerte' : 'border-filet focus:border-laiton'}`}
        />
      )}

      {erreur && <p className="mt-1 text-xs text-alerte">{erreur}</p>}

      {ouvert && !valeurAffichee && (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto border border-filet bg-papier shadow-md">
          {chargement ? (
            <p className="px-4 py-3 text-sm text-encre-pale">Recherche...</p>
          ) : resultats.length === 0 ? (
            <p className="px-4 py-3 text-sm text-encre-pale">{texteVide}</p>
          ) : (
            resultats.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectionner(option)}
                className="block w-full border-b border-filet px-4 py-2.5 text-left text-sm last:border-0 hover:bg-papier-doux"
              >
                <span className="block font-medium text-encre">{option.libelle}</span>
                {option.sousTitre && <span className="block text-xs text-encre-pale">{option.sousTitre}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
