const crypto = require("crypto");
const fs = require("fs");

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

const students = {};

for (let i = 1; i <= 10; i++) {
  students[`student${i}`] = generateToken();
}

fs.writeFileSync("tokens.json", JSON.stringify(students, null, 2));

console.log("✅ tokens.json generated:");
console.log(students);
