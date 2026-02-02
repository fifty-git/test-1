# Frontend Interview Test

This repository contains the frontend take-home assignment for the technical interview.

## Instructions

Complete the assignment according to the requirements provided separately. Submit your solution by pushing your code to this repository.

## Setup

Instructions for running the project locally will depend on the tech stack you choose. Document your setup steps here once the project is initialized.


# Remix Products CRUD (Minimal)

Proyecto de ejemplo que implementa un CRUD de `Product` con:

- Remix (servidor)
- TypeScript
- Tailwind CSS
- react-hook-form + zod

Archivos principales:

- `app/models/product.schema.ts` - Zod schema y tipo `Product`
- `app/services/db.server.ts` - Mock DB singleton
- `app/components/product-form.tsx` - Formulario con react-hook-form
- `app/routes/products.*` - Rutas para listado, crear y editar

Instrucciones rápidas:

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo (requiere `remix`):

```bash
npm run dev
```
