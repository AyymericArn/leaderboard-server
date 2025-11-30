exemple d'utilisation :
```javascript
await fetch("http://localhost:3001/score", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer DEV_2025_SECRET",
  },
  body: JSON.stringify({
    username: playerName,
    score: finalScore,
    game: "quiz",
  }),
});
```