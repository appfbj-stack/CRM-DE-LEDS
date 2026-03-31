# CRM-DE-LEDS

LeadCorretor e um PWA frontend-only para gerenciamento de leads com React + Vite.

## Variaveis de ambiente

O app nao exige variaveis obrigatorias para deploy na Vercel. Se quiser personalizar branding e storage, use estas variaveis:

```env
VITE_APP_NAME=LeadCorretor
VITE_APP_DESCRIPTION=PWA para gerenciar leads sem backend.
VITE_THEME_COLOR=#0f766e
VITE_STORAGE_KEY=leadcorretor_leads
```

## Deploy na Vercel

Use estas configuracoes:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Se nao definir variaveis na Vercel, o app sobe com os valores padrao do projeto.
