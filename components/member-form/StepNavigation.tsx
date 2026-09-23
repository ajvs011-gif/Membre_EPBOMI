'use client';

export default function StepNavigation({
  peutRevenir,
  labelSuivant = 'Suivant →',
  onPrecedent,
  onSuivant,
  envoi = false,
}: {
  peutRevenir: boolean;
  labelSuivant?: string;
  onPrecedent: () => void;
  onSuivant: () => void;
  envoi?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center gap-3 border-t border-filet pt-5">
      {peutRevenir && (
        <button
          type="button"
          onClick={onPrecedent}
          className="rounded-md px-4 py-2.5 text-sm font-medium text-encre-douce transition-colors hover:text-encre"
        >
          ← Précédent
        </button>
      )}
      <button
        type="submit"
        onClick={onSuivant}
        disabled={envoi}
        className="ml-auto rounded-md bg-encre px-6 py-2.5 text-sm font-semibold text-papier transition-opacity
                   hover:opacity-90 disabled:opacity-50"
      >
        {envoi ? 'Veuillez patienter...' : labelSuivant}
      </button>
    </div>
  );
}
