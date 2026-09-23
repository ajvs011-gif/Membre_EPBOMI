'use client';

import { useRef } from 'react';
import { appelApi } from '@/lib/api';
import { RechercheSelect, OptionRecherche } from './RechercheSelect';

interface EgliseMaisonApi {
  id_eglise_maison: number;
  nom_em: string;
  numero_em: string;
  secteur?: { nom_secteur?: string } | null;
}

export function EgliseMaisonSelect({
  valeurId,
  valeurAffichee,
  onSelectionner,
  onEffacer,
  erreur,
}: {
  valeurId: string;
  valeurAffichee: string;
  onSelectionner: (id: string, libelle: string) => void;
  onEffacer: () => void;
  erreur?: string;
}) {
  // La liste des Eglises de Maison est courte (quelques dizaines au plus) :
  // on la charge une fois et on filtre en memoire, pas d'appel a chaque frappe.
  const cacheRef = useRef<EgliseMaisonApi[] | null>(null);

  async function rechercher(terme: string): Promise<OptionRecherche[]> {
    if (!cacheRef.current) {
      cacheRef.current = await appelApi<EgliseMaisonApi[]>('/api/eglises-maison');
    }
    const t = terme.trim().toLowerCase();
    const filtrees = t
      ? cacheRef.current.filter(
          (e) => e.nom_em.toLowerCase().includes(t) || e.numero_em.toLowerCase().includes(t)
        )
      : cacheRef.current;

    return filtrees.map((e) => ({
      id: String(e.id_eglise_maison),
      libelle: e.nom_em,
      sousTitre: [e.numero_em, e.secteur?.nom_secteur].filter(Boolean).join(' · '),
    }));
  }

  return (
    <RechercheSelect
      label="Église de Maison"
      requis
      placeholder="Rechercher une Église de Maison..."
      valeurAffichee={valeurAffichee}
      erreur={erreur}
      rechercher={rechercher}
      onSelectionner={(option) => onSelectionner(option.id, option.libelle)}
      onEffacer={onEffacer}
      texteVide="Aucune Église de Maison trouvée."
    />
  );
}
