# EPBOMI - Frontend (Next.js + Tailwind)

Interface mobile-first pour saisir et consulter les membres, connectée à l'API `epbomi-api`.

## Installation

```bash
npm install
```

## Configuration

1. Copie `.env.local.example` en `.env.local`
2. Vérifie que `NEXT_PUBLIC_API_URL` pointe vers ton API backend (par défaut `http://localhost:4000`)

## Démarrage

**Important : lance d'abord le backend** (`epbomi-api`, avec `npm run dev`), puis dans ce projet :

```bash
npm run dev
```

Ouvre `http://localhost:3000` — sur ton téléphone, remplace `localhost` par l'adresse IP locale de ton PC (ex. `http://192.168.1.20:3000`), à condition que le téléphone soit sur le même réseau Wi-Fi, et que `NEXT_PUBLIC_API_URL` pointe aussi vers cette IP (pas `localhost`, qui ne veut rien dire depuis le téléphone).

## Pages

| Route | Description |
|---|---|
| `/connexion` | Login (login + mot de passe, obtient le token JWT) |
| `/membres` | Liste des membres (recherche, cartes empilées) |
| `/membres/nouveau` | Formulaire multi-étapes d'enregistrement d'un membre (6 étapes + récapitulatif) |

Le token est stocké dans le `localStorage` du navigateur ; toute page protégée redirige vers `/connexion` si absent ou expiré.

## Le formulaire multi-étapes (`/membres/nouveau`)

Architecture dans `components/member-form/` et `lib/member-form/` :

| Étape | Composant | Contenu |
|---|---|---|
| 1 | `IdentificationStep` | Identité, formation/profession, pièces, coordonnées, adresse, Église de Maison |
| 2 | `MaritalStatusStep` | Situation matrimoniale, champs dynamiques (dot, cause...) selon le choix |
| 3 | `SpiritualInfoStep` | Conversion, baptême conditionnel, religions multiples, père/mère spirituel(le) |
| 4 | `SpouseStep` | Conditionnelle : masquée si célibataire ; sinon membre existant ou fiche conjoint |
| 5 | `ChildrenStep` | Fiches enfants individuelles, compteurs calculés automatiquement |
| 6 | `ObservationStep` | Texte libre avec compteur de caractères |
| Récap | `SummaryStep` | Relecture par section avec "Modifier", puis enregistrement définitif |

- **État centralisé** : `lib/member-form/context.tsx` (Context API + hook `useMemberForm`), une clé par section — aucune donnée perdue en naviguant entre étapes.
- **Validation** : `lib/member-form/schemas.ts` (Zod), une validation par étape avant de pouvoir avancer.
- **Un seul appel réseau** : `lib/member-form/soumission.ts` construit le payload complet, envoyé une seule fois à `POST /api/membres/complet` au clic sur "Enregistrer le membre" dans le récapitulatif — rien n'est sauvegardé avant cette validation finale.

### Limitations connues (assumées, voir historique du projet)

- Un seul conjoint géré (pas de polygamie multi-fiches).
- Pas d'étape photo pour l'instant (reportée).
- Sélection du conjoint et de l'Église de Maison par ID numérique tapé à la main — un vrai sélecteur de recherche reste à faire.

## Pour la démo au client

1. Backend lancé (`npm run dev` dans `epbomi-api`, migration `EPBOMI_migration_v2.sql` déjà exécutée)
2. Frontend lancé (`npm run dev` ici)
3. Se connecter avec un compte ayant le rôle "Administrateur" ou "Secrétaire"
4. Aller sur `/membres/nouveau`, parcourir les 6 étapes, vérifier le récapitulatif, enregistrer
5. Retour automatique visible dans `/membres`

## Prochaines étapes possibles

- Page de détail/modification d'un membre (`/membres/[id]`)
- Sélecteur de recherche pour l'Église de Maison et le conjoint (au lieu de taper l'ID)
- Étape photo (upload + stockage à définir)
- Rafraîchissement automatique du token avant expiration
