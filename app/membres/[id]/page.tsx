'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { appelApi, estConnecte, ErreurApi } from '@/lib/api';
import BarreNavigationBasse from '@/components/BarreNavigationBasse';

interface FicheComplete {
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
  date_arrivee_epbomi: string | null;
  observations: string | null;
  commune: string | null;
  quartier: string | null;
  adresse_appartement: string | null;
  situation_matrimoniale: string | null;
  numero_em: string | null;
  nom_em: string | null;
  nom_secteur: string | null;
  nom_zone_locale: string | null;
  nom_zone_principale: string | null;
  pasteur: string | null;
  conjoint_membre_nom: string | null;
  conjoint_membre_prenoms: string | null;
  conjoint_non_membre_nom_prenoms: string | null;
  date_conversion: string | null;
  lieu_conversion: string | null;
  date_bapteme: string | null;
  lieu_bapteme: string | null;
  nature_bapteme: string | null;
  nom_promotion: string | null;
  telephones: string | null;
  parents: string | null;
  parents_spirituels: string | null;
  nombre_enfants: number;
  nombre_garcons: number;
  nombre_filles: number;
  nombre_enfants_decedes: number;
  religions_frequentees: string | null;
  ministeres: string | null;
}

function Ligne({ label, valeur }: { label: string; valeur: string | number | null | undefined }) {
  if (valeur === null || valeur === undefined || valeur === '') return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="shrink-0 text-encre-pale">{label}</dt>
      <dd className="text-right text-encre">{valeur}</dd>
    </div>
  );
}

function CarteSection({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="py-5">
      <h3 className="mb-1 font-serif text-[15px] font-semibold text-encre">{titre}</h3>
      <div className="mb-1 h-px bg-filet" />
      <dl className="divide-y divide-filet/60">{children}</dl>
    </section>
  );
}

export default function PageDetailMembre() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [fiche, setFiche] = useState<FicheComplete | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!estConnecte()) {
      router.push('/connexion');
      return;
    }
    (async () => {
      setChargement(true);
      setErreur(null);
      try {
        const donnees = await appelApi<FicheComplete>(`/api/membres/${params.id}/complet`);
        setFiche(donnees);
      } catch (err) {
        if (err instanceof ErreurApi && err.statut === 401) return router.push('/connexion');
        setErreur(err instanceof ErreurApi ? err.message : 'Erreur de chargement');
      } finally {
        setChargement(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/membres" className="flex items-center gap-1.5 text-sm font-medium text-encre-pale hover:text-encre">
          <ArrowLeft size={15} /> Retour
        </Link>
        {fiche && (
          <Link
            href={`/membres/${fiche.id_membre}/modifier`}
            className="flex items-center gap-1.5 rounded-md bg-encre px-4 py-2 text-sm font-semibold text-papier"
          >
            <Pencil size={14} /> Modifier
          </Link>
        )}
      </div>

      {chargement && <p className="text-center text-sm text-encre-pale">Chargement...</p>}
      {erreur && <p className="rounded-md bg-alerte/10 px-3 py-2 text-sm text-alerte">{erreur}</p>}

      {fiche && (
        <>
          <h1 className="mb-1 font-serif text-2xl font-semibold text-encre">
            {fiche.nom} {fiche.prenoms}
          </h1>
          {fiche.nom_em && <p className="mb-2 text-sm text-encre-pale">{fiche.nom_em}</p>}

          <div className="divide-y divide-filet border-t border-filet">
            <CarteSection titre="Identification">
              <Ligne label="Signification du nom" valeur={fiche.signification_nom} />
              <Ligne
                label="Naissance"
                valeur={[fiche.date_naissance, fiche.lieu_naissance].filter(Boolean).join(' à ') || null}
              />
              <Ligne label="Nationalité" valeur={fiche.nationalite} />
              <Ligne label="Ethnie" valeur={fiche.ethnie} />
              <Ligne label="Pays d'origine" valeur={fiche.pays_origine} />
              <Ligne label="Tribu" valeur={fiche.tribu} />
              <Ligne label="Ville / village" valeur={fiche.ville_village} />
              <Ligne label="Niveau intellectuel" valeur={fiche.niveau_intellectuel} />
              <Ligne label="Formation" valeur={fiche.formation} />
              <Ligne label="Profession" valeur={fiche.profession} />
              <Ligne label="Groupe sanguin" valeur={fiche.groupe_sanguin} />
              <Ligne label="Lieu de service" valeur={fiche.lieu_service} />
              <Ligne label="N° CNI" valeur={fiche.n_cni} />
              <Ligne label="N° Passeport" valeur={fiche.n_passeport} />
              <Ligne label="Email" valeur={fiche.email} />
              <Ligne label="Téléphone(s)" valeur={fiche.telephones} />
              <Ligne
                label="Adresse"
                valeur={[fiche.quartier, fiche.commune].filter(Boolean).join(', ') || null}
              />
              <Ligne label="Église de Maison" valeur={fiche.nom_em} />
              <Ligne label="Secteur" valeur={fiche.nom_secteur} />
              <Ligne label="Zone locale" valeur={fiche.nom_zone_locale} />
              <Ligne label="Zone principale" valeur={fiche.nom_zone_principale} />
              <Ligne label="Pasteur" valeur={fiche.pasteur} />
            </CarteSection>

            <CarteSection titre="Situation matrimoniale">
              <Ligne label="Situation" valeur={fiche.situation_matrimoniale} />
            </CarteSection>

            <CarteSection titre="Renseignements spirituels">
              <Ligne
                label="Conversion"
                valeur={[fiche.date_conversion, fiche.lieu_conversion].filter(Boolean).join(' à ') || null}
              />
              <Ligne
                label="Baptême"
                valeur={[fiche.date_bapteme, fiche.lieu_bapteme].filter(Boolean).join(' à ') || null}
              />
              <Ligne label="Nature du baptême" valeur={fiche.nature_bapteme} />
              <Ligne label="Promotion de baptême" valeur={fiche.nom_promotion} />
              <Ligne label="Religions fréquentées" valeur={fiche.religions_frequentees} />
              <Ligne label="Parents spirituels" valeur={fiche.parents_spirituels} />
              <Ligne label="Ministère(s)" valeur={fiche.ministeres} />
            </CarteSection>

            {(fiche.conjoint_membre_nom || fiche.conjoint_non_membre_nom_prenoms) && (
              <CarteSection titre="Conjoint">
                <Ligne
                  label="Conjoint"
                  valeur={
                    fiche.conjoint_membre_nom
                      ? `${fiche.conjoint_membre_nom} ${fiche.conjoint_membre_prenoms ?? ''} (membre EPBOMI)`
                      : fiche.conjoint_non_membre_nom_prenoms
                  }
                />
              </CarteSection>
            )}

            <CarteSection titre="Enfants">
              <Ligne label="Total" valeur={fiche.nombre_enfants} />
              <Ligne label="Garçons" valeur={fiche.nombre_garcons} />
              <Ligne label="Filles" valeur={fiche.nombre_filles} />
              <Ligne label="Décédés" valeur={fiche.nombre_enfants_decedes} />
            </CarteSection>

            {fiche.parents && (
              <CarteSection titre="Parents">
                <Ligne label="Parents" valeur={fiche.parents} />
              </CarteSection>
            )}

            {fiche.observations && (
              <CarteSection titre="Observations">
                <p className="py-1.5 text-sm text-encre">{fiche.observations}</p>
              </CarteSection>
            )}
          </div>
        </>
      )}

      <BarreNavigationBasse />
    </main>
  );
}
