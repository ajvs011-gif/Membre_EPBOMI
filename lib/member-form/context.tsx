'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Structure centralisee, une cle par etape (comme demande dans le cahier des charges)
export interface DonneesFormulaireMembre {
  identification: {
    nom: string;
    prenoms: string;
    signification_nom: string;
    date_naissance: string;
    lieu_naissance: string;
    nationalite: string;
    ethnie: string;
    pays_origine: string;
    tribu: string;
    ville_village: string;
    niveau_intellectuel: string;
    formation: string;
    profession: string;
    lieu_service: string;
    groupe_sanguin: string;
    email: string;
    n_cni: string;
    n_passeport: string;
    id_eglise_maison: string;
    nomAfficheEgliseMaison: string;
    commune: string;
    quartier: string;
    telephone: string;
  };
  situationMatrimoniale: {
    id_situation: string;
    date_evenement: string;
    lieu_evenement: string;
    dot: string;
    cause: string;
  };
  spirituel: {
    date_conversion: string;
    lieu_conversion: string;
    est_baptise: 'oui' | 'non';
    date_bapteme: string;
    lieu_bapteme: string;
    nature_bapteme: 'Immersion' | 'Aspersion' | '';
    nom_promotion: string;
    religions: string[];
    autreReligion: string;
    derniereReligion: string;
    aParentSpirituel: 'oui' | 'non';
    typeParentSpirituel: 'Pere spirituel' | 'Mere spirituelle' | '';
    nomParentSpirituel: string;
    prenomsParentSpirituel: string;
    egliseParentSpirituel: string;
    telephoneParentSpirituel: string;
  };
  conjoint: {
    conjointEstMembre: 'oui' | 'non' | '';
    idMembreConjoint: string;
    nomAfficheConjoint: string;
    nom_prenoms: string;
    nationalite: string;
    ethnie: string;
    tel: string;
    domicile: string;
    n_appartement: string;
    lieu_travail: string;
    eglise_frequentee: string;
    nature_bapteme: string;
  };
  enfants: {
    aDesEnfants: 'oui' | 'non';
    enfants: {
      nom_prenoms: string;
      sexe: 'Garcon' | 'Fille' | '';
      est_chretien: boolean;
      est_decede: boolean;
      cause_deces: string;
    }[];
  };
  observations: string;
}

export const donneesInitiales: DonneesFormulaireMembre = {
  identification: {
    nom: '', prenoms: '', signification_nom: '', date_naissance: '', lieu_naissance: '',
    nationalite: '', ethnie: '', pays_origine: '', tribu: '', ville_village: '',
    niveau_intellectuel: '', formation: '', profession: '', lieu_service: '', groupe_sanguin: '',
    email: '', n_cni: '', n_passeport: '', id_eglise_maison: '', nomAfficheEgliseMaison: '',
    commune: '', quartier: '', telephone: '',
  },
  situationMatrimoniale: { id_situation: '', date_evenement: '', lieu_evenement: '', dot: '', cause: '' },
  spirituel: {
    date_conversion: '', lieu_conversion: '', est_baptise: 'non', date_bapteme: '', lieu_bapteme: '',
    nature_bapteme: '', nom_promotion: '', religions: [], autreReligion: '', derniereReligion: '',
    aParentSpirituel: 'non', typeParentSpirituel: '', nomParentSpirituel: '', prenomsParentSpirituel: '',
    egliseParentSpirituel: '', telephoneParentSpirituel: '',
  },
  conjoint: {
    conjointEstMembre: '', idMembreConjoint: '', nomAfficheConjoint: '', nom_prenoms: '', nationalite: '', ethnie: '', tel: '',
    domicile: '', n_appartement: '', lieu_travail: '', eglise_frequentee: '', nature_bapteme: '',
  },
  enfants: { aDesEnfants: 'non', enfants: [] },
  observations: '',
};

export const ETAPES = [
  { cle: 'identification', numero: 1, titre: 'Identification' },
  { cle: 'situationMatrimoniale', numero: 2, titre: 'Situation' },
  { cle: 'spirituel', numero: 3, titre: 'Spirituel' },
  { cle: 'conjoint', numero: 4, titre: 'Conjoint' },
  { cle: 'enfants', numero: 5, titre: 'Enfants' },
  { cle: 'observations', numero: 6, titre: 'Observation' },
] as const;

interface ContexteFormulaireMembre {
  donnees: DonneesFormulaireMembre;
  majSection: <K extends keyof DonneesFormulaireMembre>(section: K, valeurs: Partial<DonneesFormulaireMembre[K]>) => void;
  etapeCourante: number;
  allerA: (numero: number) => void;
  etapeSuivante: () => void;
  etapePrecedente: () => void;
  etapesValidees: Set<number>;
  marquerEtapeValidee: (numero: number) => void;
  setObservations: (valeur: string) => void;
}

const Contexte = createContext<ContexteFormulaireMembre | null>(null);

export function FournisseurFormulaireMembre({ children }: { children: ReactNode }) {
  const [donnees, setDonnees] = useState<DonneesFormulaireMembre>(donneesInitiales);
  const [etapeCourante, setEtapeCourante] = useState(1);
  const [etapesValidees, setEtapesValidees] = useState<Set<number>>(new Set());

  function majSection<K extends Exclude<keyof DonneesFormulaireMembre, 'observations'>>(
    section: K,
    valeurs: Partial<DonneesFormulaireMembre[K]>
  ) {
    setDonnees((d) => ({ ...d, [section]: { ...(d[section] as object), ...valeurs } }));
  }

  function setObservations(valeur: string) {
    setDonnees((d) => ({ ...d, observations: valeur }));
  }

  function allerA(numero: number) {
    setEtapeCourante(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function etapeSuivante() {
    setEtapesValidees((s) => new Set(s).add(etapeCourante));
    allerA(Math.min(etapeCourante + 1, ETAPES.length + 1)); // +1 = recapitulatif
  }

  function etapePrecedente() {
    allerA(Math.max(etapeCourante - 1, 1));
  }

  function marquerEtapeValidee(numero: number) {
    setEtapesValidees((s) => new Set(s).add(numero));
  }

  return (
    <Contexte.Provider
      value={{ donnees, majSection, etapeCourante, allerA, etapeSuivante, etapePrecedente, etapesValidees, marquerEtapeValidee, setObservations }}
    >
      {children}
    </Contexte.Provider>
  );
}

export function useMemberForm() {
  const ctx = useContext(Contexte);
  if (!ctx) throw new Error('useMemberForm doit etre utilise a l\'interieur de FournisseurFormulaireMembre');
  return ctx;
}
