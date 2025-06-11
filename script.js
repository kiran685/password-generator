const lengthInput = document.getElementById("length");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const specialCheckbox = document.getElementById("special");
const generateBtn = document.getElementById("generate-btn");
const resultArea = document.getElementById("result");
const copyBtn = document.getElementById("copy-btn");
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";

function generatePassword() {
  let length = parseInt(lengthInput.value);
  if (isNaN(length) || length < 4 || length > 64) {
    alert("Please enter a length between 4 and 64");
    return;
  }

  let charPool = "";
  if (uppercaseCheckbox.checked) charPool += UPPERCASE_CHARS;
  if (lowercaseCheckbox.checked) charPool += LOWERCASE_CHARS;
  if (numbersCheckbox.checked) charPool += NUMBER_CHARS;
  if (specialCheckbox.checked) charPool += SPECIAL_CHARS;

  if (charPool === "") {
    alert("Please select at least one character type");
    return;
  }

  let password = "";

  // Guarantee at least one character from each selected category
  let guaranteedChars = [];
  if (uppercaseCheckbox.checked) guaranteedChars.push(randomChar(UPPERCASE_CHARS));
  if (lowercaseCheckbox.checked) guaranteedChars.push(randomChar(LOWERCASE_CHARS));
  if (numbersCheckbox.checked) guaranteedChars.push(randomChar(NUMBER_CHARS));
  if (specialCheckbox.checked) guaranteedChars.push(randomChar(SPECIAL_CHARS));

  for (let i = 0; i < length - guaranteedChars.length; i++) {
    password += randomChar(charPool);
  }

  // Insert guaranteed chars at random positions
  password = password.split('');
  guaranteedChars.forEach(char => {
    const pos = Math.floor(Math.random() * password.length);
    password.splice(pos, 0, char);
  });

  resultArea.value = password.join('');
  updateStrengthMeter(resultArea.value);
}

function randomChar(str) {
  return str.charAt(Math.floor(Math.random() * str.length));
}

function calculateStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score; // score from 0 to 6
}

function updateStrengthMeter(password) {
  const score = calculateStrength(password);
  const percent = (score / 6) * 100;
  strengthFill.style.width = percent + "%";

  if (score <= 2) {
    strengthFill.style.background = "#ff4d4d"; // red
    strengthText.textContent = "Weak";
  } else if (score <= 4) {
    strengthFill.style.background = "#ffa500"; // orange
    strengthText.textContent = "Medium";
  } else {
    strengthFill.style.background = "#00c851"; // green
    strengthText.textContent = "Strong";
  }
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", () => {
  if (!resultArea.value) return alert("Generate a password first!");
  navigator.clipboard.writeText(resultArea.value).then(() => {
    alert("Password copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy password.");
  });
});
