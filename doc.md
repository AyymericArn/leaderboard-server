# Documentation API – Leaderboard (React Quiz & 2048)

## URL

*(exemple à adapter)*

```
https://ton-serveur.com/api/scores

```

---

## Authentification (obligatoire)

Chaque requête doit contenir un header :

```
Authorization: Bearer VOTRE_TOKEN

```

Ce token vous est donné par le professeur.

Sans ce header → la requête sera refusée.

---

## 1. Envoyer un score

### Endpoint

```
POST /api/scores

```

### Headers

```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN

```

### Body

```json
{
  "game": "quiz",
  "score": 8
}

```

ou

```json
{
  "game": "2048",
  "score": 1580
}

```

**Remarques :**

- `game` doit être `"quiz"` ou `"2048"`
- `score` doit être un nombre

---

### Exemple avec fetch (React)

```jsx
fetch("https://ton-serveur.com/api/scores", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer VOTRE_TOKEN"
  },
  body: JSON.stringify({
    game: "2048",
    score: 1520
  })
})
.then(res => res.json())
.then(data => console.log(data));

```

---

## 2. Lire le leaderboard

### Endpoint

```
GET /api/scores?game=2048

```

ou

```
GET /api/scores?game=quiz

```

### Exemple

```jsx
fetch("https://ton-serveur.com/api/scores?game=quiz", {
  headers: {
    "Authorization": "Bearer VOTRE_TOKEN"
  }
})
.then(res => res.json())
.then(data => {
  console.log("Leaderboard :", data);
});

```

---

## Exemple de réponse

```json
[
  { "username": "student2", "score": 9, "timestamp": "2025-05-01T14:00:00Z" },
  { "username": "student5", "score": 8, "timestamp": "2025-05-01T13:30:00Z" }
]

```

---

## Bonnes pratiques

- N'envoyez votre score qu'à la fin de la partie.
- Utilisez toujours le token fourni.
- N’essayez pas d’envoyer des scores pour d’autres participants.