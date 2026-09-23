'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { appelApi, estConnecte, ErreurApi } from '@/lib/api';
import { OPTIONS_SITUATION } from '@/lib/member-form/schemas';
import { Champ, Section } from '@/components/member-form/ChampsCommuns';
import { EgliseMaisonSelect } from '@/components/member-form/EgliseMaisonSelect';

interface MembreBrut {
  id_membre: number;
  nom: string;
  prenoms: string;
  signification_nom: string | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  nationalite: string | null;
  ethnie: string | null;
  pays_origine: string | null;
  tribu: string | null;
  ville_village: string | null;
  n_cni: string | null;
  n_passeport: string | null;
  niveau_intellectuel: string | null;
  formation: string | null;
  profession: string | null;
  groupe_sanguin: string | null;
  lieu_service: string | null;
  email: string | null;
  id_eglise_maison: number;
  id_situation: number | null;
}

interface FicheComplete {
  commune: string | null;
  quartier: string | null;
  nom_em: string | null;
}

interface FormEdition {
  nom: string; prenoms: string; signification_nom: string; date_naissance: string; lieu_naissance: string;
  nationalite: string; ethnie: string; pays_origine: string; tribu: string; ville_village: string;
  niveau_intellectuel: string; formation: string; profession: string; groupe_sanguin: string;
  lieu_service: string; email: string; n_cni: string; n_passeport: string;
  id_eglise_maison: string; nomAfficheEgliseMaison: string; id_situation: string;
  commune: string; quartier: string;
}

const dateAuFormatInput = (v: string | null) => (v ? v.slice(0, 10) : '');

export default function PageModifierMembre() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<FormEdition | null>(null);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreursChamps, setErreursChamps] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (!estConnecte()) {
      router.push('/connexion');
      return;
    }
    (async () => {
      setChargement(true);
      setErreur(null);
      try {
        const [brut, complet] = await Promise.all([
          appelApi<MembreBrut>(`/api/membres/${params.id}`),
          appelApi<FicheComplete>(`/api/membres/${params.id}/complet`),
        ]);
        setForm({
          nom: brut.nom, prenoms: brut.prenoms,
          signification_nom: brut.signification_nom ?? '',
          date_naissance: dateAuFormatInput(brut.date_naissance),
          lieu_naissance: brut.lieu_naissance ?? '',
          nationalite: brut.nationalite ?? '', ethnie: brut.ethnie ?? '',
          pays_origine: brut.pays_origine ?? '', tribu: brut.tribu ?? '', ville_village: brut.ville_village ?? '',
          niveau_intellectuel: brut.niveau_intellectuel ?? '', formation: brut.formation ?? '',
          profession: brut.profession ?? '', groupe_sanguin: brut.groupe_sanguin ?? '',
          lieu_service: brut.lieu_service ?? '', email: brut.email ?? '',
          n_cni: brut.n_cni ?? '', n_passeport: brut.n_passeport ?? '',
          id_eglise_maison: String(brut.id_eglise_maison), nomAfficheEgliseMaison: complet.nom_em ?? '',
          id_situation: brut.id_situation ? String(brut.id_situation) : '',
          commune: complet.commune ?? '', quartier: complet.quartier ?? '',
        });
      } catch (err) {
        if (err instanceof ErreurApi && err.statut === 401) return router.push('/connexion');
        setErreur(err instanceof ErreurApi ? err.message : 'Erreur de chargement');
      } finally {
        setChargement(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  function maj<K extends keyof FormEdition>(champ: K, valeur: FormEdition[K]) {
    setForm((f) => (f ? { ...f, [champ]: valeur } : f));
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setErreur(null);
    setErreursChamps({});
    setEnvoi(true);

    const corps: Record<string, unknown> = {
      nom: form.nom,
      prenoms: form.prenoms,
      id_eglise_maison: Number(form.id_eglise_maison),
    };
    const optionnels: (keyof FormEdition)[] = [
      'signification_nom', 'lieu_naissance', 'nationalite', 'ethnie', 'pays_origine', 'tribu',
      'ville_village', 'niveau_intellectuel', 'formation', 'profession', 'groupe_sanguin',
      'lieu_service', 'email', 'n_cni', 'n_passeport',
    ];
    optionnels.forEach((champ) => {
      if (form[champ]) corps[champ] = form[champ];
    });
    if (form.date_naissance) corps.date_naissance = form.date_naissance;
    if (form.id_situation) corps.id_situation = Number(form.id_situation);
    if (form.commune || form.quartier) {
      corps.adresse = { commune: form.commune || undefined, quartier: form.quartier || undefined };
    }

    try {
      await appelApi(`/api/membres/${params.id}`, { method: 'PUT', body: JSON.stringify(corps) });
      router.push(`/membres/${params.id}`);
    } catch (err) {
      if (err instanceof ErreurApi) {
        if (err.statut === 401) return router.push('/connexion');
        setErreur(err.message);
        if (err.details) setErreursChamps(err.details);
      } else {
        setErreur('Erreur inattendue');
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      <Link href={`/membres/${params.id}`} className="mb-4 inline-block text-sm font-medium text-encre-pale">
        ← Annuler
      </Link>

      {chargement && <p className="text-center text-sm text-encre-pale">Chargement...</p>}
      {erreur && <p className="mb-4 rounded-lg bg-alerte/10 px-3 py-2 text-sm text-alerte">{erreur}</p>}

      {form && (
        <form onSubmit={enregistrer} className="space-y-4">
          <h1 className="text-xl font-serif font-semibold text-encre">
            Modifier {form.nom} {form.prenoms}
          </h1>

          <Section titre="Identité">
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Nom" requis valeur={form.nom} erreur={erreursChamps.nom?.[0]} onChange={(v) => maj('nom', v)} />
              <Champ label="Prénoms" requis valeur={form.prenoms} erreur={erreursChamps.prenoms?.[0]} onChange={(v) => maj('prenoms', v)} />
            </div>
            <Champ label="Signification du nom" valeur={form.signification_nom} onChange={(v) => maj('signification_nom', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Date de naissance" type="date" valeur={form.date_naissance} onChange={(v) => maj('date_naissance', v)} />
              <Champ label="Lieu de naissance" valeur={form.lieu_naissance} onChange={(v) => maj('lieu_naissance', v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Nationalité" valeur={form.nationalite} onChange={(v) => maj('nationalite', v)} />
              <Champ label="Ethnie" valeur={form.ethnie} onChange={(v) => maj('ethnie', v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Pays d'origine" valeur={form.pays_origine} onChange={(v) => maj('pays_origine', v)} />
              <Champ label="Tribu" valeur={form.tribu} onChange={(v) => maj('tribu', v)} />
            </div>
            <Champ label="Ville / village" valeur={form.ville_village} onChange={(v) => maj('ville_village', v)} />
          </Section>

          <Section titre="Formation et profession">
            <Champ label="Niveau intellectuel" valeur={form.niveau_intellectuel} onChange={(v) => maj('niveau_intellectuel', v)} />
            <Champ label="Formation" valeur={form.formation} onChange={(v) => maj('formation', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Profession" valeur={form.profession} onChange={(v) => maj('profession', v)} />
              <Champ label="Groupe sanguin" valeur={form.groupe_sanguin} onChange={(v) => maj('groupe_sanguin', v)} />
            </div>
            <Champ label="Lieu de service" valeur={form.lieu_service} onChange={(v) => maj('lieu_service', v)} />
          </Section>

          <Section titre="Pièces et coordonnées">
            <div className="grid grid-cols-2 gap-3">
              <Champ label="N° CNI" valeur={form.n_cni} onChange={(v) => maj('n_cni', v)} />
              <Champ label="N° Passeport" valeur={form.n_passeport} onChange={(v) => maj('n_passeport', v)} />
            </div>
            <Champ label="Email" type="email" valeur={form.email} erreur={erreursChamps.email?.[0]} onChange={(v) => maj('email', v)} />
          </Section>

          <Section titre="Adresse">
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Commune" valeur={form.commune} onChange={(v) => maj('commune', v)} />
              <Champ label="Quartier" valeur={form.quartier} onChange={(v) => maj('quartier', v)} />
            </div>
          </Section>

          <Section titre="Situation et organisation">
            <div>
              <label className="mb-1 block text-sm font-medium text-encre-douce">Situation matrimoniale</label>
              <select
                value={form.id_situation}
                onChange={(e) => maj('id_situation', e.target.value)}
                className="w-full border-b border-filet bg-transparent px-0.5 py-2.5 text-[15px] text-encre
                           focus:border-laiton focus:outline-none"
              >
                <option value="">-- Non renseigné --</option>
                {OPTIONS_SITUATION.map((o) => (
                  <option key={o.id} value={o.id}>{o.libelle}</option>
                ))}
              </select>
            </div>
            <EgliseMaisonSelect
              valeurId={form.id_eglise_maison}
              valeurAffichee={form.nomAfficheEgliseMaison}
              erreur={erreursChamps.id_eglise_maison?.[0]}
              onSelectionner={(id, libelle) => {
                maj('id_eglise_maison', id);
                maj('nomAfficheEgliseMaison', libelle);
              }}
              onEffacer={() => {
                maj('id_eglise_maison', '');
                maj('nomAfficheEgliseMaison', '');
              }}
            />
          </Section>

          <p className="text-xs text-encre-pale">
            Situation matrimoniale, spirituel, conjoint et enfants détaillés ne sont pas encore modifiables ici —
            seuls l'identification, l'adresse et l'Église de Maison le sont pour l'instant.
          </p>

          <button
            type="submit"
            disabled={envoi}
            className="w-full rounded-md bg-encre py-3 text-[15px] font-semibold text-papier transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {envoi ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      )}
    </main>
  );
}
