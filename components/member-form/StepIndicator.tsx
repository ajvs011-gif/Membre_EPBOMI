'use client';

import { ETAPES } from '@/lib/member-form/context';

export default function StepIndicator({
  etapeCourante,
  etapesValidees,
  onClicEtape,
}: {
  etapeCourante: number;
  etapesValidees: Set<number>;
  onClicEtape: (numero: number) => void;
}) {
  const total = ETAPES.length;
  const progression = ((etapeCourante - 1) / (total - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Ligne de progression : le registre qui se "remplit" a l'encre au fil du parcours */}
      <div className="relative mb-3 h-px bg-filet">
        <div
          className="absolute left-0 top-0 h-px bg-laiton transition-all duration-500 ease-out"
          style={{ width: `${progression}%` }}
        />
      </div>

      <ol className="flex items-start justify-between gap-1 overflow-x-auto">
        {ETAPES.map((etape) => {
          const validee = etapesValidees.has(etape.numero);
          const active = etapeCourante === etape.numero;
          const accessible = validee || active;

          return (
            <li key={etape.cle} className="flex min-w-0 flex-1 flex-col items-center">
              <button
                type="button"
                disabled={!accessible}
                onClick={() => accessible && onClicEtape(etape.numero)}
                className="flex flex-col items-center gap-1.5 px-0.5"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-serif text-[11px] font-semibold transition-colors
                    ${active
                      ? 'bg-encre text-papier'
                      : validee
                      ? 'border border-laiton text-laiton-fonce'
                      : 'border border-filet text-encre-pale'}`}
                >
                  {validee && !active ? '✓' : etape.numero}
                </span>
                <span
                  className={`hidden text-center text-[10px] font-medium leading-tight sm:block
                    ${active ? 'text-encre' : 'text-encre-pale'}`}
                >
                  {etape.titre}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
