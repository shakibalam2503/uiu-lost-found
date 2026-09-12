const { EMAIL_DOMAIN_ROLE } = require("../config/roles");

const getRoleFromEmail = (email) => {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.toLowerCase();

  for (const [domain, role] of Object.entries(EMAIL_DOMAIN_ROLE)) {
    if (normalizedEmail.endsWith(domain)) {
      return role;
    }
  }

  return null;
};

const validateUniversityUser = (email) => {
  const role = getRoleFromEmail(email);

  if (!role) {
    return {
      valid: false,
      role: null,
    };
  }

  return {
    valid: true,
    role,
  };
};

module.exports = {
  getRoleFromEmail,
  validateUniversityUser,
};