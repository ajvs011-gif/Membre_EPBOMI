'use client';

import { useState } from 'react';
import { useMemberForm } from '@/lib/member-form/context';
import { OPTIONS_SITUATION } from '@/lib/member-form/schemas';
import { Champ, Section } from './ChampsCommuns';
import { ConjointMembreSelect } from './ConjointMembreSelect';
import StepNavigation from './StepNavigation';

export default function SpouseStep() {
  const { donnees, majSection, etapeSuivante, etapePrecedente } = useMemberForm();
  const d = donnees.conjoint;
  const [erreur, setErreur] = useState<string | null>(null);

  const situationChoisie = OPTIONS_SITUATION.find((o) => o.id === donnees.situationMatrimoniale.id_situation);
  const estCelibataire = situationChoisie?.libelle === 'Célibataire';

  function suivant() {
    if (!estCelibataire) {
      if (!d.conjointEstMembre) {
        setErreur('Veuillez préciser si le conjoint est déjà membre EPBOMI.');
        return;
      }
      if (d.conjointEstMembre === 'oui' && !d.idMembreConjoint) {
        setErreur("Veuillez indiquer l'ID du membre conjoint.");
        return;
      }
      if (d.conjointEstMembre === 'non' && !d.nom_prenoms) {
        setErreur('Veuillez indiquer au moins le nom et prénoms du conjoint.');
        return;
      }
    }
    setErreur(null);
    etapeSuivante();
  }

  if (estCelibataire) {
    return (
      <div>
        <h2 className="mb-4 text-lg font-bold text-encre">Coordonnées du conjoint</h2>
        <div className="rounded-md border border-dashed border-filet bg-papier-doux p-8 text-center text-sm text-encre-pale">
          Cette section ne vous concerne pas.
        </div>
        <StepNavigation peutRevenir onPrecedent={etapePrecedente} onSuivant={etapeSuivante} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-encre">Coordonnées du conjoint</h2>

      <Section titre="Le conjoint est-il déjà membre EPBOMI ?">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => majSection('conjoint', { conjointEstMembre: 'oui' })}
            className={`rounded-md border py-3 text-sm font-semibold transition
              ${d.conjointEstMembre === 'oui' ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce' : 'border-filet text-encre-pale'}`}
          >
            Oui, déjà membre
          </button>
          <button
            type="button"
            onClick={() => majSection('conjoint', { conjointEstMembre: 'non' })}
            className={`rounded-md border py-3 text-sm font-semibold transition
              ${d.conjointEstMembre === 'non' ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce' : 'border-filet text-encre-pale'}`}
          >
            Non
          </button>
        </div>
        {erreur && <p className="mt-2 text-xs text-alerte">{erreur}</p>}
      </Section>

      {d.conjointEstMembre === 'oui' && (
        <div className="mt-4">
          <Section titre="Membre existant">
            <ConjointMembreSelect
              valeurAffichee={d.nomAfficheConjoint}
              onSelectionner={(id, libelle) =>
                majSection('conjoint', { idMembreConjoint: id, nomAfficheConjoint: libelle })
              }
              onEffacer={() => majSection('conjoint', { idMembreConjoint: '', nomAfficheConjoint: '' })}
            />
          </Section>
        </div>
      )}

      {d.conjointEstMembre === 'non' && (
        <div className="mt-4">
          <Section titre="Informations du conjoint">
            <Champ label="Nom et prénoms" valeur={d.nom_prenoms} onChange={(v) => majSection('conjoint', { nom_prenoms: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Nationalité" valeur={d.nationalite} onChange={(v) => majSection('conjoint', { nationalite: v })} />
              <Champ label="Ethnie" valeur={d.ethnie} onChange={(v) => majSection('conjoint', { ethnie: v })} />
            </div>
            <Champ label="Téléphone" valeur={d.tel} onChange={(v) => majSection('conjoint', { tel: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Domicile" valeur={d.domicile} onChange={(v) => majSection('conjoint', { domicile: v })} />
              <Champ label="N° Appartement" valeur={d.n_appartement} onChange={(v) => majSection('conjoint', { n_appartement: v })} />
            </div>
            <Champ label="Lieu de travail" valeur={d.lieu_travail} onChange={(v) => majSection('conjoint', { lieu_travail: v })} />
            <Champ label="Église fréquentée" valeur={d.eglise_frequentee} onChange={(v) => majSection('conjoint', { eglise_frequentee: v })} />
            <Champ label="Nature (baptême)" valeur={d.nature_bapteme} onChange={(v) => majSection('conjoint', { nature_bapteme: v })} />
          </Section>
        </div>
      )}

      <StepNavigation peutRevenir onPrecedent={etapePrecedente} onSuivant={suivant} />
    </div>
  );
}
