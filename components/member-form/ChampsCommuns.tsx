'use client';

export function Champ({
  label,
  valeur,
  onChange,
  type = 'text',
  requis = false,
  erreur,
  placeholder,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  type?: string;
  requis?: boolean;
  erreur?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-encre-douce">
        {label}
        {requis && <span className="text-laiton-fonce"> *</span>}
      </label>
      <input
        type={type}
        value={valeur}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-b bg-transparent px-0.5 py-2.5 text-[15px] text-encre placeholder:text-encre-pale/60
          focus:outline-none
          ${erreur ? 'border-alerte' : 'border-filet focus:border-laiton'}`}
      />
      {erreur && <p className="mt-1 text-xs text-alerte">{erreur}</p>}
    </div>
  );
}

export function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="font-serif text-[15px] font-semibold tracking-tight text-encre">{titre}</h3>
      <div className="h-px bg-filet" />
      <div className="space-y-4 pt-1">{children}</div>
    </section>
  );
}

/** Choix binaire Oui/Non sous forme de deux boutons (plus tactile qu'un select) */
export function ChoixOuiNon({
  label,
  valeur,
  onChange,
}: {
  label: string;
  valeur: 'oui' | 'non';
  onChange: (v: 'oui' | 'non') => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-encre-douce">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {(['oui', 'non'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-md border py-2.5 text-sm font-medium capitalize transition-colors
              ${valeur === option
                ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce'
                : 'border-filet text-encre-douce'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
