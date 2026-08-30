# Site Vitrine - 300 Poils

Site vitrine professionnel avec système de prise de rendez-vous intégré via Cal.com.

## 🚀 Stack technique

- **Frontend** : React 18 + TypeScript + Vite
- **Routing** : TanStack Router (file-based)
- **Styling** : Tailwind CSS v4
- **Réservation** : Cal.com (inline embed)
- **Hébergement** : Vercel + Cloudflare
- **Traductions** : FR/EN via fichiers JSON

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/zura2612/300poils.git
cd 300poils

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer en développement
pnpm dev