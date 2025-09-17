export function checkPhone(val) {
  let pattern = /^[\+]?\d{1,3}-\d{9}$/; // Example: +256-712345678  or 256-712345678
  return pattern.test(val);
}

export function checkName(val) {
  // Covers A-Z, a-z, 0-9, and accented ranges like À-ÿ (Latin-1 Supplement)
  const pattern = /^[A-Za-z0-9À-ÖØ-öø-ÿ][A-Za-z0-9À-ÖØ-öø-ÿ_.-\s]*$/;
  return pattern.test(val);
}



export function checkString(val) {
  return val && val.trim().length > 0;
}

export function checkNumber(val) {
  let pattern = /^\d+$/;
  return pattern.test(val);
}
export function checkMail(val) {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(val);
}

export function checkPassword(val) {
  let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return pattern.test(val);
}

export function checkURL(val) {
  let pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(val);
}

export function checkImage(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Only JPEG, PNG and GIF are allowed";
  }
  if (file.size > maxSize) {  // 👈 fixed typo (was file.sise)
    return `File size exceeds the maximum allowed size of ${
      maxSize / 1024 / 1024
    }MB`;
  }
  return true;
}
