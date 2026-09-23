'use client';

import { useState } from 'react';
import { useMemberForm } from '@/lib/member-form/context';
import { OPTIONS_SITUATION } from '@/lib/member-form/schemas';
import { Champ, Section } from './ChampsCommuns';
import StepNavigation from './StepNavigation';

export default function MaritalStatusStep() {
  const { donnees, majSection, etapeSuivante, etapePrecedente } = useMemberForm();
  const d = donnees.situationMatrimoniale;
  const [erreur, setErreur] = useState<string | null>(null);

  const optionChoisie = OPTIONS_SITUATION.find((o) => o.id === d.id_situation);
  const afficherEvenement = optionChoisie?.necessiteEvenement ?? false;
  const estDivorceOuSeparation = optionChoisie?.libelle === 'Divorcé(e)' || optionChoisie?.libelle === 'Séparé(e) de corps';

  function suivant() {
    if (!d.id_situation) {
      setErreur('Veuillez sélectionner une situation matrimoniale.');
      return;
    }
    setErreur(null);
    etapeSuivante();
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-encre">Situation matrimoniale</h2>

      <Section titre="Situation actuelle">
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS_SITUATION.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => majSection('situationMatrimoniale', { id_situation: option.id })}
              className={`rounded-md border px-3 py-3 text-left text-sm font-medium transition
                ${d.id_situation === option.id
                  ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce'
                  : 'border-filet text-encre-douce'}`}
            >
              {option.libelle}
            </button>
          ))}
        </div>
        {erreur && <p className="mt-2 text-xs text-alerte">{erreur}</p>}
      </Section>

      {/* Champs dynamiques : n'apparaissent que si pertinents pour le choix fait */}
      {afficherEvenement && (
        <div className="mt-4">
          <Section titre={`Détails — ${optionChoisie?.libelle}`}>
            <div className="grid grid-cols-2 gap-3">
              <Champ
                label="Date"
                type="date"
                valeur={d.date_evenement}
                onChange={(v) => majSection('situationMatrimoniale', { date_evenement: v })}
              />
              <Champ
                label="Lieu"
                valeur={d.lieu_evenement}
                onChange={(v) => majSection('situationMatrimoniale', { lieu_evenement: v })}
              />
            </div>

            {optionChoisie?.libelle === 'Marié(e) coutumièrement' && (
              <Champ label="Dot" valeur={d.dot} onChange={(v) => majSection('situationMatrimoniale', { dot: v })} />
            )}

            {estDivorceOuSeparation && (
              <Champ label="Cause" valeur={d.cause} onChange={(v) => majSection('situationMatrimoniale', { cause: v })} />
            )}
          </Section>
        </div>
      )}

      <StepNavigation peutRevenir onPrecedent={etapePrecedente} onSuivant={suivant} />
    </div>
  );
}
