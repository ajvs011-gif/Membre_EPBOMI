'use client';

import { useState } from 'react';
import { useMemberForm } from '@/lib/member-form/context';
import { etapeIdentificationSchema } from '@/lib/member-form/schemas';
import { Champ, Section } from './ChampsCommuns';
import { EgliseMaisonSelect } from './EgliseMaisonSelect';
import StepNavigation from './StepNavigation';

export default function IdentificationStep() {
  const { donnees, majSection, etapeSuivante } = useMemberForm();
  const d = donnees.identification;
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  function valider(): boolean {
    const resultat = etapeIdentificationSchema.safeParse(d);
    if (!resultat.success) {
      const nouvellesErreurs: Record<string, string> = {};
      for (const [champ, messages] of Object.entries(resultat.error.flatten().fieldErrors)) {
        if (messages?.[0]) nouvellesErreurs[champ] = messages[0];
      }
      setErreurs(nouvellesErreurs);
      return false;
    }
    setErreurs({});
    return true;
  }

  function suivant() {
    if (valider()) etapeSuivante();
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-encre">Identification</h2>

      <div className="space-y-8">
        <Section titre="Identité">
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Nom" requis valeur={d.nom} erreur={erreurs.nom} onChange={(v) => majSection('identification', { nom: v })} />
            <Champ label="Prénoms" requis valeur={d.prenoms} erreur={erreurs.prenoms} onChange={(v) => majSection('identification', { prenoms: v })} />
          </div>
          <Champ label="Signification du nom" valeur={d.signification_nom} onChange={(v) => majSection('identification', { signification_nom: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Date de naissance" type="date" valeur={d.date_naissance} onChange={(v) => majSection('identification', { date_naissance: v })} />
            <Champ label="Lieu de naissance" valeur={d.lieu_naissance} onChange={(v) => majSection('identification', { lieu_naissance: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Nationalité" valeur={d.nationalite} onChange={(v) => majSection('identification', { nationalite: v })} />
            <Champ label="Ethnie" valeur={d.ethnie} onChange={(v) => majSection('identification', { ethnie: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Pays d'origine" valeur={d.pays_origine} onChange={(v) => majSection('identification', { pays_origine: v })} />
            <Champ label="Tribu" valeur={d.tribu} onChange={(v) => majSection('identification', { tribu: v })} />
          </div>
          <Champ label="Ville / village" valeur={d.ville_village} onChange={(v) => majSection('identification', { ville_village: v })} />
        </Section>

        <Section titre="Formation et profession">
          <Champ label="Niveau intellectuel" valeur={d.niveau_intellectuel} onChange={(v) => majSection('identification', { niveau_intellectuel: v })} />
          <Champ label="Formation" valeur={d.formation} onChange={(v) => majSection('identification', { formation: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Profession" valeur={d.profession} onChange={(v) => majSection('identification', { profession: v })} />
            <Champ label="Groupe sanguin" valeur={d.groupe_sanguin} onChange={(v) => majSection('identification', { groupe_sanguin: v })} />
          </div>
          <Champ label="Lieu de service" valeur={d.lieu_service} onChange={(v) => majSection('identification', { lieu_service: v })} />
        </Section>

        <Section titre="Pièces et coordonnées">
          <div className="grid grid-cols-2 gap-3">
            <Champ label="N° CNI" valeur={d.n_cni} onChange={(v) => majSection('identification', { n_cni: v })} />
            <Champ label="N° Passeport" valeur={d.n_passeport} onChange={(v) => majSection('identification', { n_passeport: v })} />
          </div>
          <Champ label="Email" type="email" valeur={d.email} erreur={erreurs.email} onChange={(v) => majSection('identification', { email: v })} />
          <Champ label="Téléphone" valeur={d.telephone} onChange={(v) => majSection('identification', { telephone: v })} />
        </Section>

        <Section titre="Adresse">
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Commune" valeur={d.commune} onChange={(v) => majSection('identification', { commune: v })} />
            <Champ label="Quartier" valeur={d.quartier} onChange={(v) => majSection('identification', { quartier: v })} />
          </div>
        </Section>

        <Section titre="Église">
          <EgliseMaisonSelect
            valeurId={d.id_eglise_maison}
            valeurAffichee={d.nomAfficheEgliseMaison}
            erreur={erreurs.id_eglise_maison}
            onSelectionner={(id, libelle) =>
              majSection('identification', { id_eglise_maison: id, nomAfficheEgliseMaison: libelle })
            }
            onEffacer={() => majSection('identification', { id_eglise_maison: '', nomAfficheEgliseMaison: '' })}
          />
        </Section>
      </div>

      <StepNavigation peutRevenir={false} onPrecedent={() => {}} onSuivant={suivant} />
    </div>
  );
}
