# Lagerhantering SPA - React + Typescript + JWT

Detta projekt är en single page application utvecklad med react och typescript.  
Applikationen använder ett separat backend API med JWT baserad autentisering och fullständig CRUD funktionalitet för produkter.


## Funktionalitet

### Backend
- REST API byggt med express och typescript
- SQLite databas
- JWT autentisering
- Skyddade endpoints med token verifiering
- CRUD för produkter:
  - GET /products
  - GET /products/:id
  - POST /products (protected)
  - PUT /products/:id (protected)
  - DELETE /products/:id (protected)

### Frontend (React SPA)
- React router med dynamiska routes
- Publik produktlista
- Dynamisk produktsida
- JWT inloggning
- Skyddad administrativ vy
- CRUD hantering via frontend
- Responsiv design
- Tydlig felhantering och användarfeedback
- TypeScript med väldefinierade types

## Installation och körning

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend körs på 
```bash
http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend körs på 
```bash
http://localhost:5173
```

## Testinlogg
Användarnamn: admin
Lösenord: admin123


