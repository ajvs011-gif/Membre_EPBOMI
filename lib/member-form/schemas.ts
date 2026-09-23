import { z } from 'zod';

export const etapeIdentificationSchema = z.object({
  nom: z.string().min(1, 'Le nom est obligatoire.'),
  prenoms: z.string().min(1, 'Les prénoms sont obligatoires.'),
  signification_nom: z.string().optional(),
  date_naissance: z.string().optional(),
  lieu_naissance: z.string().optional(),
  nationalite: z.string().optional(),
  ethnie: z.string().optional(),
  pays_origine: z.string().optional(),
  tribu: z.string().optional(),
  ville_village: z.string().optional(),
  niveau_intellectuel: z.string().optional(),
  formation: z.string().optional(),
  profession: z.string().optional(),
  lieu_service: z.string().optional(),
  groupe_sanguin: z.string().optional(),
  email: z.string().email('Veuillez saisir une adresse email valide.').optional().or(z.literal('')),
  n_cni: z.string().optional(),
  n_passeport: z.string().optional(),
  id_eglise_maison: z.string().min(1, "L'Église de Maison est obligatoire."),
  commune: z.string().optional(),
  quartier: z.string().optional(),
  telephone: z.string().optional(),
});

export const OPTIONS_SITUATION = [
  { id: '1', libelle: 'Célibataire', necessiteEvenement: false },
  { id: '2', libelle: 'Concubinage', necessiteEvenement: true },
  { id: '3', libelle: 'Fiancé(e)', necessiteEvenement: true },
  { id: '4', libelle: 'Marié(e) coutumièrement', necessiteEvenement: true },
  { id: '5', libelle: 'Séparé(e) de corps', necessiteEvenement: true },
  { id: '6', libelle: 'Divorcé(e)', necessiteEvenement: true },
  { id: '7', libelle: 'Veuf/Veuve', necessiteEvenement: true },
  { id: '8', libelle: 'Polygame', necessiteEvenement: false },
] as const;

export const etapeSituationMatrimonialeSchema = z.object({
  id_situation: z.string().min(1, 'Veuillez sélectionner une situation matrimoniale.'),
  date_evenement: z.string().optional(),
  lieu_evenement: z.string().optional(),
  dot: z.string().optional(),
  cause: z.string().optional(),
});

export const etapeSpiritueleSchema = z.object({
  date_conversion: z.string().optional(),
  lieu_conversion: z.string().optional(),
  est_baptise: z.enum(['oui', 'non']).default('non'),
  date_bapteme: z.string().optional(),
  lieu_bapteme: z.string().optional(),
  nature_bapteme: z.enum(['Immersion', 'Aspersion', '']).optional(),
  nom_promotion: z.string().optional(),
  religions: z.array(z.string()).default([]),
  autreReligion: z.string().optional(),
  derniereReligion: z.string().optional(),
  aParentSpirituel: z.enum(['oui', 'non']).default('non'),
  typeParentSpirituel: z.enum(['Pere spirituel', 'Mere spirituelle', '']).optional(),
  nomParentSpirituel: z.string().optional(),
  prenomsParentSpirituel: z.string().optional(),
  egliseParentSpirituel: z.string().optional(),
  telephoneParentSpirituel: z.string().optional(),
});

export const etapeConjointSchema = z.object({
  conjointEstMembre: z.enum(['oui', 'non']).optional(),
  idMembreConjoint: z.string().optional(),
  nom_prenoms: z.string().optional(),
  nationalite: z.string().optional(),
  ethnie: z.string().optional(),
  tel: z.string().optional(),
  domicile: z.string().optional(),
  n_appartement: z.string().optional(),
  lieu_travail: z.string().optional(),
  eglise_frequentee: z.string().optional(),
  nature_bapteme: z.string().optional(),
});

export const etapeEnfantsSchema = z.object({
  aDesEnfants: z.enum(['oui', 'non']).default('non'),
  enfants: z
    .array(
      z.object({
        nom_prenoms: z.string().min(1, "Le nom de l'enfant est requis."),
        sexe: z.enum(['Garcon', 'Fille', '']).optional(),
        est_chretien: z.boolean().optional(),
        est_decede: z.boolean().optional(),
        cause_deces: z.string().optional(),
      })
    )
    .default([]),
});

export const etapeObservationSchema = z.object({
  observations: z.string().max(2000, 'Maximum 2000 caractères.').optional(),
});
