const URL_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function obtenirJeton(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('epbomi_jeton');
}

export function definirJeton(jeton: string) {
  localStorage.setItem('epbomi_jeton', jeton);
}

export function supprimerJeton() {
  localStorage.removeItem('epbomi_jeton');
}

export function estConnecte(): boolean {
  return Boolean(obtenirJeton());
}

interface OptionsRequete extends RequestInit {
  /** Passe a false pour les routes publiques (ex: /api/auth/login) */
  authentifie?: boolean;
}

export class ErreurApi extends Error {
  statut: number;
  details?: Record<string, string[] | undefined>;

  constructor(message: string, statut: number, details?: Record<string, string[] | undefined>) {
    super(message);
    this.statut = statut;
    this.details = details;
  }
}

export async function appelApi<T = unknown>(chemin: string, options: OptionsRequete = {}): Promise<T> {
  const { authentifie = true, headers, ...reste } = options;

  const enTetes: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (authentifie) {
    const jeton = obtenirJeton();
    if (jeton) enTetes.Authorization = `Bearer ${jeton}`;
  }

  let reponse: Response;
  try {
    reponse = await fetch(`${URL_API}${chemin}`, { ...reste, headers: enTetes });
  } catch {
    throw new ErreurApi(
      `Impossible de joindre l'API (${URL_API}). Le serveur backend tourne-t-il ?`,
      0
    );
  }

  const donnees = await reponse.json().catch(() => null);

  if (!reponse.ok) {
    throw new ErreurApi(donnees?.erreur || `Erreur ${reponse.status}`, reponse.status, donnees?.details);
  }

  return donnees as T;
}
