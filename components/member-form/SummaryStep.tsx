'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMemberForm } from '@/lib/member-form/context';
import { OPTIONS_SITUATION } from '@/lib/member-form/schemas';
import { construirePayload } from '@/lib/member-form/soumission';
import { appelApi, ErreurApi } from '@/lib/api';

interface LigneRecap {
  label: string;
  valeur: string;
}

function SectionRecap({
  titre,
  numeroEtape,
  onModifier,
  lignes,
}: {
  titre: string;
  numeroEtape: number;
  onModifier: (n: number) => void;
  lignes: LigneRecap[];
}) {
  return (
    <div className="rounded-md border border-filet bg-papier-doux p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-encre-douce">{titre}</h3>
        <button
          type="button"
          onClick={() => onModifier(numeroEtape)}
          className="text-xs font-medium text-laiton-fonce"
        >
          Modifier
        </button>
      </div>
      {lignes.length === 0 ? (
        <p className="text-sm text-encre-pale">Aucune information renseignée.</p>
      ) : (
        <dl className="space-y-1">
          {lignes.map((ligne) => (
            <div key={ligne.label} className="flex justify-between gap-3 text-sm">
              <dt className="text-encre-pale">{ligne.label}</dt>
              <dd className="text-right text-encre">{ligne.valeur}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export default function SummaryStep() {
  const router = useRouter();
  const { donnees, allerA, etapePrecedente } = useMemberForm();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const id = donnees.identification;
  const sm = donnees.situationMatrimoniale;
  const sp = donnees.spirituel;
  const cj = donnees.conjoint;
  const en = donnees.enfants;

  const situationChoisie = OPTIONS_SITUATION.find((o) => o.id === sm.id_situation);
  const estCelibataire = situationChoisie?.libelle === 'Célibataire';

  async function enregistrer() {
    setErreur(null);
    setEnvoi(true);
    try {
      const payload = construirePayload(donnees);
      const resultat = await appelApi<{ id_membre: number }>('/api/membres/complet', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      router.push(`/membres?cree=${resultat.id_membre}`);
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : 'Erreur inattendue lors de l\'enregistrement');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-encre">Récapitulatif</h2>
      <p className="mb-4 text-sm text-encre-pale">Vérifiez les informations avant l'enregistrement définitif.</p>

      <div className="space-y-3">
        <SectionRecap
          titre="Identification"
          numeroEtape={1}
          onModifier={allerA}
          lignes={[
            { label: 'Nom', valeur: id.nom || '—' },
            { label: 'Prénoms', valeur: id.prenoms || '—' },
            { label: 'Naissance', valeur: [id.date_naissance, id.lieu_naissance].filter(Boolean).join(' à ') || '—' },
            { label: 'Nationalité / Ethnie', valeur: [id.nationalite, id.ethnie].filter(Boolean).join(' / ') || '—' },
            { label: 'Profession', valeur: id.profession || '—' },
            { label: 'Email', valeur: id.email || '—' },
            { label: 'Téléphone', valeur: id.telephone || '—' },
            { label: 'Église de Maison', valeur: id.nomAfficheEgliseMaison || '—' },
          ]}
        />

        <SectionRecap
          titre="Situation matrimoniale"
          numeroEtape={2}
          onModifier={allerA}
          lignes={[
            { label: 'Situation', valeur: situationChoisie?.libelle || '—' },
            ...(sm.date_evenement ? [{ label: 'Date', valeur: sm.date_evenement }] : []),
            ...(sm.lieu_evenement ? [{ label: 'Lieu', valeur: sm.lieu_evenement }] : []),
          ]}
        />

        <SectionRecap
          titre="Renseignements spirituels"
          numeroEtape={3}
          onModifier={allerA}
          lignes={[
            ...(sp.date_conversion || sp.lieu_conversion
              ? [{ label: 'Conversion', valeur: [sp.date_conversion, sp.lieu_conversion].filter(Boolean).join(' à ') }]
              : []),
            { label: 'Baptisé(e)', valeur: sp.est_baptise === 'oui' ? 'Oui' : 'Non' },
            ...(sp.est_baptise === 'oui' && sp.nature_bapteme ? [{ label: 'Nature du baptême', valeur: sp.nature_bapteme }] : []),
            ...(sp.est_baptise === 'oui' && sp.nom_promotion ? [{ label: 'Promotion', valeur: sp.nom_promotion }] : []),
            ...(sp.religions.length > 0 ? [{ label: 'Religions fréquentées', valeur: sp.religions.join(', ') }] : []),
            ...(sp.aParentSpirituel === 'oui'
              ? [{ label: sp.typeParentSpirituel === 'Mere spirituelle' ? 'Mère spirituelle' : 'Père spirituel', valeur: [sp.nomParentSpirituel, sp.prenomsParentSpirituel].filter(Boolean).join(' ') || '—' }]
              : []),
          ]}
        />

        <SectionRecap
          titre="Conjoint"
          numeroEtape={4}
          onModifier={allerA}
          lignes={
            estCelibataire
              ? [{ label: 'Statut', valeur: 'Ne concerne pas (célibataire)' }]
              : cj.conjointEstMembre === 'oui'
              ? [{ label: 'Membre EPBOMI', valeur: cj.nomAfficheConjoint || '—' }]
              : cj.conjointEstMembre === 'non'
              ? [{ label: 'Nom et prénoms', valeur: cj.nom_prenoms || '—' }]
              : []
          }
        />

        <SectionRecap
          titre="Enfants"
          numeroEtape={5}
          onModifier={allerA}
          lignes={
            en.aDesEnfants === 'oui'
              ? [
                  { label: 'Total', valeur: String(en.enfants.length) },
                  { label: 'Garçons', valeur: String(en.enfants.filter((e) => e.sexe === 'Garcon').length) },
                  { label: 'Filles', valeur: String(en.enfants.filter((e) => e.sexe === 'Fille').length) },
                  { label: 'Chrétiens', valeur: String(en.enfants.filter((e) => e.est_chretien).length) },
                  { label: 'Décédés', valeur: String(en.enfants.filter((e) => e.est_decede).length) },
                ]
              : [{ label: 'Enfants', valeur: 'Aucun' }]
          }
        />

        <SectionRecap
          titre="Observation"
          numeroEtape={6}
          onModifier={allerA}
          lignes={donnees.observations.trim() ? [{ label: 'Remarque', valeur: donnees.observations.trim() }] : []}
        />
      </div>

      {erreur && <p className="mt-4 rounded-lg bg-alerte/10 px-3 py-2 text-sm text-alerte">{erreur}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={etapePrecedente}
          className="flex-1 rounded-md border border-filet py-3 text-sm font-semibold text-encre-douce"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={enregistrer}
          disabled={envoi}
          className="flex-1 rounded-md bg-encre py-3 text-sm font-semibold text-papier transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {envoi ? 'Enregistrement...' : '✓ Enregistrer le membre'}
        </button>
      </div>
    </div>
  );
}
