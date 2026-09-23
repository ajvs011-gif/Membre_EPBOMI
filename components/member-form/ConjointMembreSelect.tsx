'use client';

import { appelApi } from '@/lib/api';
import { RechercheSelect, OptionRecherche } from './RechercheSelect';

interface MembreApi {
  id_membre: number;
  nom: string;
  prenoms: string;
  profession: string | null;
}

interface ReponseListeMembres {
  resultats: MembreApi[];
}

export function ConjointMembreSelect({
  valeurAffichee,
  onSelectionner,
  onEffacer,
  erreur,
  idMembreAExclure,
}: {
  valeurAffichee: string;
  onSelectionner: (id: string, libelle: string) => void;
  onEffacer: () => void;
  erreur?: string;
  /** Optionnel : exclure le membre lui-meme de la recherche (evite l'auto-mariage) */
  idMembreAExclure?: string;
}) {
  async function rechercher(terme: string): Promise<OptionRecherche[]> {
    // Recherche distante : la liste des membres peut etre grande (~1000),
    // pas question de tout charger d'un coup. Rien tant que 2 caracteres min.
    if (terme.trim().length < 2) return [];

    const parametres = new URLSearchParams({ limite: '10', recherche: terme.trim() });
    const reponse = await appelApi<ReponseListeMembres>(`/api/membres?${parametres.toString()}`);

    return reponse.resultats
      .filter((m) => String(m.id_membre) !== idMembreAExclure)
      .map((m) => ({
        id: String(m.id_membre),
        libelle: `${m.nom} ${m.prenoms}`,
        sousTitre: m.profession ?? undefined,
      }));
  }

  return (
    <RechercheSelect
      label="Conjoint (membre existant)"
      requis
      placeholder="Tapez au moins 2 lettres du nom..."
      valeurAffichee={valeurAffichee}
      erreur={erreur}
      rechercher={rechercher}
      onSelectionner={(option) => onSelectionner(option.id, option.libelle)}
      onEffacer={onEffacer}
      texteVide="Aucun membre trouvé — vérifiez l'orthographe, ou renseignez-le comme non-membre."
    />
  );
}
