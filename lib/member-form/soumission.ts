import { DonneesFormulaireMembre } from './context';
import { OPTIONS_SITUATION } from './schemas';

function videSiVide(valeur: string): string | undefined {
  return valeur.trim() ? valeur.trim() : undefined;
}

export function construirePayload(donnees: DonneesFormulaireMembre): Record<string, unknown> {
  const id = donnees.identification;
  const sm = donnees.situationMatrimoniale;
  const sp = donnees.spirituel;
  const cj = donnees.conjoint;
  const en = donnees.enfants;

  const situationChoisie = OPTIONS_SITUATION.find((o) => o.id === sm.id_situation);
  const estCelibataire = situationChoisie?.libelle === 'Célibataire';

  const payload: Record<string, unknown> = {
    nom: id.nom,
    prenoms: id.prenoms,
    signification_nom: videSiVide(id.signification_nom),
    date_naissance: videSiVide(id.date_naissance),
    lieu_naissance: videSiVide(id.lieu_naissance),
    nationalite: videSiVide(id.nationalite),
    ethnie: videSiVide(id.ethnie),
    pays_origine: videSiVide(id.pays_origine),
    tribu: videSiVide(id.tribu),
    ville_village: videSiVide(id.ville_village),
    niveau_intellectuel: videSiVide(id.niveau_intellectuel),
    formation: videSiVide(id.formation),
    profession: videSiVide(id.profession),
    lieu_service: videSiVide(id.lieu_service),
    groupe_sanguin: videSiVide(id.groupe_sanguin),
    email: videSiVide(id.email),
    n_cni: videSiVide(id.n_cni),
    n_passeport: videSiVide(id.n_passeport),
    id_eglise_maison: Number(id.id_eglise_maison),
  };

  if (id.commune || id.quartier) {
    payload.adresse = { commune: videSiVide(id.commune), quartier: videSiVide(id.quartier) };
  }
  if (id.telephone) {
    payload.telephones = [{ numero: id.telephone }];
  }

  // --- Situation matrimoniale ---
  if (sm.id_situation) {
    const evenement =
      sm.date_evenement || sm.lieu_evenement || sm.dot || sm.cause
        ? {
            date_evenement: videSiVide(sm.date_evenement),
            lieu_evenement: videSiVide(sm.lieu_evenement),
            dot: videSiVide(sm.dot),
            cause: videSiVide(sm.cause),
          }
        : undefined;

    payload.situationMatrimoniale = { id_situation: Number(sm.id_situation), evenement };
  }

  // --- Spirituel ---
  if (sp.date_conversion || sp.lieu_conversion) {
    payload.conversion = { date_conversion: videSiVide(sp.date_conversion), lieu_conversion: videSiVide(sp.lieu_conversion) };
  }

  if (sp.est_baptise === 'oui') {
    payload.bapteme = {
      est_baptise: true,
      date_bapteme: videSiVide(sp.date_bapteme),
      lieu_bapteme: videSiVide(sp.lieu_bapteme),
      nature_bapteme: sp.nature_bapteme || undefined,
      nom_promotion: videSiVide(sp.nom_promotion),
    };
  }

  const religionsAAvertir = sp.religions
    .map((r) => (r === 'Autre' ? sp.autreReligion : r))
    .filter((r): r is string => Boolean(r && r.trim()));

  if (religionsAAvertir.length > 0) {
    payload.religions = religionsAAvertir.map((nom_religion) => ({
      nom_religion,
      derniere: nom_religion === (sp.derniereReligion === 'Autre' ? sp.autreReligion : sp.derniereReligion),
    }));
  }

  if (sp.aParentSpirituel === 'oui' && sp.typeParentSpirituel) {
    payload.parentSpirituel = {
      role: sp.typeParentSpirituel,
      nom: videSiVide(sp.nomParentSpirituel),
      prenoms: videSiVide(sp.prenomsParentSpirituel),
      eglise: videSiVide(sp.egliseParentSpirituel),
      telephone: videSiVide(sp.telephoneParentSpirituel),
    };
  }

  // --- Conjoint (rien si celibataire) ---
  if (!estCelibataire && cj.conjointEstMembre === 'oui' && cj.idMembreConjoint) {
    payload.conjoint = { estMembre: true, id_membre_conjoint: Number(cj.idMembreConjoint) };
  } else if (!estCelibataire && cj.conjointEstMembre === 'non' && cj.nom_prenoms) {
    payload.conjoint = {
      estMembre: false,
      nom_prenoms: cj.nom_prenoms,
      nationalite: videSiVide(cj.nationalite),
      ethnie: videSiVide(cj.ethnie),
      tel: videSiVide(cj.tel),
      domicile: videSiVide(cj.domicile),
      n_appartement: videSiVide(cj.n_appartement),
      lieu_travail: videSiVide(cj.lieu_travail),
      eglise_frequentee: videSiVide(cj.eglise_frequentee),
      nature_bapteme: videSiVide(cj.nature_bapteme),
    };
  }

  // --- Enfants ---
  if (en.aDesEnfants === 'oui' && en.enfants.length > 0) {
    payload.enfants = en.enfants.map((e) => ({
      nom_prenoms: e.nom_prenoms,
      sexe: e.sexe || undefined,
      est_chretien: e.est_chretien,
      est_decede: e.est_decede,
      cause_deces: e.est_decede ? videSiVide(e.cause_deces) : undefined,
    }));
  }

  // --- Observations ---
  if (donnees.observations.trim()) {
    payload.observations = donnees.observations.trim();
  }

  return payload;
}
