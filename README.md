# HRemote Client

Client de prise en main à distance brandé Hsasoft, basé sur RustDesk.

## Prérequis (sur le poste de build Windows)

1. **Node.js 20+** → https://nodejs.org/
2. **Rust** → https://rustup.rs/ (installer `rustup`, puis `rustup target add x86_64-pc-windows-msvc`)
3. **Visual Studio Build Tools** → https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Cocher : "Développement Desktop en C++"
4. **WebView2** → Inclus dans Windows 11, sinon : https://developer.microsoft.com/en-us/microsoft-edge/webview2/

## Logo

Placer le logo Hsasoft dans :
- `public/logo.png` (utilisé dans l'UI)
- `src-tauri/icons/` (générer les icônes avec `npm run tauri icon public/logo.png`)

## Compilation

```bash
# 1. Installer les dépendances
npm install

# 2. Générer les icônes depuis le logo
npm run tauri icon public/logo.png

# 3. Build production (génère un .exe installeur dans src-tauri/target/release/bundle/)
npm run tauri build
```

## Développement

```bash
npm run tauri dev
```

## Configuration serveur

Les paramètres serveur sont dans `src/App.tsx` :
```ts
const SERVER_ID = "82.29.178.71";
const SERVER_KEY = "NRn5b6AAO1Vts7n0DwTeExSFeTz0Dh+pazl15e3DS9Q=";
```

## Utilisation

1. Le technicien ouvre HRemote
2. Saisit l'ID machine (généré depuis https://hremote.hsasoft.io)
3. Choisit le mode : **Lecture** (vue écran seule) ou **Contrôle** (prise en main complète)
4. Clique "Se connecter" → RustDesk s'ouvre automatiquement

> ⚠️ RustDesk doit être installé sur le poste technicien : https://rustdesk.com/fr/download/
