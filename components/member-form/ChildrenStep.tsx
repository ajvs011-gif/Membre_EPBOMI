'use client';

import { useMemberForm } from '@/lib/member-form/context';
import { ChoixOuiNon, Champ, Section } from './ChampsCommuns';
import StepNavigation from './StepNavigation';

const ENFANT_VIDE = { nom_prenoms: '', sexe: '' as const, est_chretien: false, est_decede: false, cause_deces: '' };

export default function ChildrenStep() {
  const { donnees, majSection, etapeSuivante, etapePrecedente } = useMemberForm();
  const d = donnees.enfants;

  const total = d.enfants.length;
  const garcons = d.enfants.filter((e) => e.sexe === 'Garcon').length;
  const filles = d.enfants.filter((e) => e.sexe === 'Fille').length;
  const chretiens = d.enfants.filter((e) => e.est_chretien).length;
  const decedes = d.enfants.filter((e) => e.est_decede).length;

  function ajouterEnfant() {
    majSection('enfants', { enfants: [...d.enfants, { ...ENFANT_VIDE }] });
  }

  function supprimerEnfant(index: number) {
    majSection('enfants', { enfants: d.enfants.filter((_, i) => i !== index) });
  }

  function majEnfant(index: number, champ: keyof (typeof d.enfants)[number], valeur: string | boolean) {
    const copie = [...d.enfants];
    copie[index] = { ...copie[index], [champ]: valeur };
    majSection('enfants', { enfants: copie });
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-encre">Enfants</h2>

      <ChoixOuiNon
        label="Avez-vous des enfants ?"
        valeur={d.aDesEnfants}
        onChange={(v) => majSection('enfants', { aDesEnfants: v, enfants: v === 'non' ? [] : d.enfants })}
      />

      {d.aDesEnfants === 'oui' && (
        <div className="mt-4 space-y-4">
          {/* Compteurs calcules automatiquement, non saisis */}
          <div className="grid grid-cols-3 gap-2 rounded-md bg-papier-doux p-3 text-center sm:grid-cols-5">
            <Compteur label="Total" valeur={total} />
            <Compteur label="Garçons" valeur={garcons} />
            <Compteur label="Filles" valeur={filles} />
            <Compteur label="Chrétiens" valeur={chretiens} />
            <Compteur label="Décédés" valeur={decedes} />
          </div>

          {d.enfants.map((enfant, index) => (
            <Section key={index} titre={`Enfant ${index + 1}`}>
              <button
                type="button"
                onClick={() => supprimerEnfant(index)}
                className="float-right -mt-1 text-xs font-medium text-alerte"
              >
                Supprimer
              </button>
              <Champ
                label="Nom et prénoms"
                requis
                valeur={enfant.nom_prenoms}
                onChange={(v) => majEnfant(index, 'nom_prenoms', v)}
              />
              <div className="grid grid-cols-2 gap-2">
                {(['Garcon', 'Fille'] as const).map((sexe) => (
                  <button
                    key={sexe}
                    type="button"
                    onClick={() => majEnfant(index, 'sexe', sexe)}
                    className={`rounded-md border py-2.5 text-sm font-medium transition
                      ${enfant.sexe === sexe ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce' : 'border-filet text-encre-douce'}`}
                  >
                    {sexe === 'Garcon' ? 'Garçon' : 'Fille'}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-encre-douce">
                <input
                  type="checkbox"
                  checked={enfant.est_chretien}
                  onChange={(e) => majEnfant(index, 'est_chretien', e.target.checked)}
                  className="accent-laiton"
                />
                Enfant chrétien
              </label>
              <label className="flex items-center gap-2 text-sm text-encre-douce">
                <input
                  type="checkbox"
                  checked={enfant.est_decede}
                  onChange={(e) => majEnfant(index, 'est_decede', e.target.checked)}
                  className="accent-laiton"
                />
                Enfant décédé
              </label>
              {enfant.est_decede && (
                <Champ label="Cause du décès" valeur={enfant.cause_deces} onChange={(v) => majEnfant(index, 'cause_deces', v)} />
              )}
            </Section>
          ))}

          <button
            type="button"
            onClick={ajouterEnfant}
            className="w-full rounded-md border-2 border-dashed border-filet py-3 text-sm font-medium text-encre-pale"
          >
            + Ajouter un enfant
          </button>
        </div>
      )}

      <StepNavigation peutRevenir onPrecedent={etapePrecedente} onSuivant={etapeSuivante} />
    </div>
  );
}

function Compteur({ label, valeur }: { label: string; valeur: number }) {
  return (
    <div>
      <p className="text-lg font-bold text-encre">{valeur}</p>
      <p className="text-[10px] text-encre-pale">{label}</p>
    </div>
  );
}
