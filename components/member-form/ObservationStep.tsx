'use client';

import { useMemberForm } from '@/lib/member-form/context';
import StepNavigation from './StepNavigation';

const MAX_CARACTERES = 2000;

export default function ObservationStep() {
  const { donnees, setObservations, etapeSuivante, etapePrecedente } = useMemberForm();

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-encre">Observation générale</h2>

      <div className="rounded-md border border-filet bg-papier-doux p-4">
        <textarea
          value={donnees.observations}
          maxLength={MAX_CARACTERES}
          onChange={(e) => setObservations(e.target.value)}
          rows={8}
          placeholder="Remarques complémentaires sur le membre..."
          className="w-full resize-none rounded-md border border-filet px-4 py-3 text-base
                     focus:border-laiton focus:outline-none focus:ring-1 focus:ring-laiton"
        />
        <p className="mt-2 text-right text-xs text-encre-pale">
          {donnees.observations.length} / {MAX_CARACTERES}
        </p>
      </div>

      <StepNavigation peutRevenir onPrecedent={etapePrecedente} onSuivant={etapeSuivante} labelSuivant="Voir le récapitulatif →" />
    </div>
  );
}
