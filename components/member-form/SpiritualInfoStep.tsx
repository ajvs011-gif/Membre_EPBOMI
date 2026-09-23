'use client';

import { useMemberForm } from '@/lib/member-form/context';
import { Champ, Section, ChoixOuiNon } from './ChampsCommuns';
import StepNavigation from './StepNavigation';

const RELIGIONS_COURANTES = ['Christianisme évangélique', 'Catholicisme', 'Islam', 'Animisme'];

export default function SpiritualInfoStep() {
  const { donnees, majSection, etapeSuivante, etapePrecedente } = useMemberForm();
  const d = donnees.spirituel;

  const religionsChoisies = [...d.religions];
  const aChoisiAutre = religionsChoisies.includes('Autre');
  const toutesReligionsAffichees = religionsChoisies.map((r) => (r === 'Autre' ? d.autreReligion || 'Autre' : r)).filter(Boolean);

  function basculerReligion(religion: string) {
    const presente = d.religions.includes(religion);
    const nouvelles = presente ? d.religions.filter((r) => r !== religion) : [...d.religions, religion];
    majSection('spirituel', { religions: nouvelles });
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-encre">Renseignements spirituels</h2>

      <div className="space-y-8">
        <Section titre="Conversion">
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Date de conversion" type="date" valeur={d.date_conversion} onChange={(v) => majSection('spirituel', { date_conversion: v })} />
            <Champ label="Lieu de conversion" valeur={d.lieu_conversion} onChange={(v) => majSection('spirituel', { lieu_conversion: v })} />
          </div>
        </Section>

        <Section titre="Baptême">
          <ChoixOuiNon label="Êtes-vous baptisé(e) ?" valeur={d.est_baptise} onChange={(v) => majSection('spirituel', { est_baptise: v })} />

          {d.est_baptise === 'oui' && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <Champ label="Date du baptême" type="date" valeur={d.date_bapteme} onChange={(v) => majSection('spirituel', { date_bapteme: v })} />
                <Champ label="Lieu du baptême" valeur={d.lieu_bapteme} onChange={(v) => majSection('spirituel', { lieu_bapteme: v })} />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-encre-douce">Nature du baptême</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['Immersion', 'Aspersion'] as const).map((nature) => (
                    <button
                      key={nature}
                      type="button"
                      onClick={() => majSection('spirituel', { nature_bapteme: nature })}
                      className={`rounded-md border py-3 text-sm font-medium transition
                        ${d.nature_bapteme === nature
                          ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce'
                          : 'border-filet text-encre-douce'}`}
                    >
                      {nature}
                    </button>
                  ))}
                </div>
              </div>

              <Champ
                label="Promotion de baptême"
                placeholder="ex : Promotion Grâce 2023"
                valeur={d.nom_promotion}
                onChange={(v) => majSection('spirituel', { nom_promotion: v })}
              />
            </div>
          )}
        </Section>

        <Section titre="Religions fréquentées">
          <p className="text-xs text-encre-pale">Plusieurs choix possibles</p>
          <div className="grid grid-cols-2 gap-2">
            {[...RELIGIONS_COURANTES, 'Autre'].map((religion) => (
              <label
                key={religion}
                className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm
                  ${d.religions.includes(religion) ? 'border-laiton bg-laiton-clair/50' : 'border-filet'}`}
              >
                <input
                  type="checkbox"
                  checked={d.religions.includes(religion)}
                  onChange={() => basculerReligion(religion)}
                  className="accent-laiton"
                />
                {religion}
              </label>
            ))}
          </div>

          {aChoisiAutre && (
            <Champ label="Préciser l'autre religion" valeur={d.autreReligion} onChange={(v) => majSection('spirituel', { autreReligion: v })} />
          )}

          {toutesReligionsAffichees.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-encre-douce">Dernière religion fréquentée</label>
              <select
                value={d.derniereReligion}
                onChange={(e) => majSection('spirituel', { derniereReligion: e.target.value })}
                className="w-full rounded-md border border-filet bg-papier-doux px-4 py-3 text-base
                           focus:border-laiton focus:outline-none focus:ring-1 focus:ring-laiton"
              >
                <option value="">-- Non renseigné --</option>
                {toutesReligionsAffichees.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
        </Section>

        <Section titre="Père / Mère spirituel(le)">
          <ChoixOuiNon
            label="Avez-vous un père ou une mère spirituel(le) ?"
            valeur={d.aParentSpirituel}
            onChange={(v) => majSection('spirituel', { aParentSpirituel: v })}
          />

          {d.aParentSpirituel === 'oui' && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                {(['Pere spirituel', 'Mere spirituelle'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => majSection('spirituel', { typeParentSpirituel: type })}
                    className={`rounded-md border py-3 text-sm font-medium transition
                      ${d.typeParentSpirituel === type
                        ? 'border-laiton bg-laiton-clair/50 text-laiton-fonce'
                        : 'border-filet text-encre-douce'}`}
                  >
                    {type === 'Pere spirituel' ? 'Père spirituel' : 'Mère spirituelle'}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Champ label="Nom" valeur={d.nomParentSpirituel} onChange={(v) => majSection('spirituel', { nomParentSpirituel: v })} />
                <Champ label="Prénoms" valeur={d.prenomsParentSpirituel} onChange={(v) => majSection('spirituel', { prenomsParentSpirituel: v })} />
              </div>
              <Champ label="Église" valeur={d.egliseParentSpirituel} onChange={(v) => majSection('spirituel', { egliseParentSpirituel: v })} />
              <Champ label="Téléphone" valeur={d.telephoneParentSpirituel} onChange={(v) => majSection('spirituel', { telephoneParentSpirituel: v })} />
              <p className="text-xs text-encre-pale">
                Cette personne n'a pas besoin d'être déjà enregistrée comme membre — elle peut appartenir à une autre Église.
              </p>
            </div>
          )}
        </Section>
      </div>

      <StepNavigation peutRevenir onPrecedent={etapePrecedente} onSuivant={etapeSuivante} />
    </div>
  );
}
