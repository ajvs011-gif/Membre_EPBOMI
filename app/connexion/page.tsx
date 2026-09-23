'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appelApi, definirJeton, ErreurApi } from '@/lib/api';

interface ReponseConnexion {
  token: string;
  utilisateur: { id_utilisateur: number; login: string; roles: string[] };
}

export default function PageConnexion() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      const reponse = await appelApi<ReponseConnexion>('/api/auth/login', {
        method: 'POST',
        authentifie: false,
        body: JSON.stringify({ login, mot_de_passe: motDePasse }),
      });
      definirJeton(reponse.token);
      router.push('/membres');
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : 'Erreur de connexion');
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-laiton-fonce">
            Registre des membres
          </p>
          <h1 className="font-serif text-3xl font-semibold text-encre">EPBOMI</h1>
          <div className="mx-auto mt-4 h-px w-12 bg-filet" />
        </div>

        <form onSubmit={soumettre} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-encre-douce">Identifiant</label>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border-b border-filet bg-transparent px-0.5 py-2.5 text-[15px] text-encre
                         focus:border-laiton focus:outline-none"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-encre-douce">Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full border-b border-filet bg-transparent px-0.5 py-2.5 text-[15px] text-encre
                         focus:border-laiton focus:outline-none"
              autoComplete="current-password"
              required
            />
          </div>

          {erreur && (
            <p className="rounded-md bg-alerte/10 px-3 py-2 text-sm text-alerte">{erreur}</p>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-md bg-encre py-3 text-[15px] font-semibold text-papier
                       transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}
