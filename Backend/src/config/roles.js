const ROLE = {
  STUDENT: "student",
  FACULTY: "faculty",
  STAFF: "staff",
  ADMIN: "admin",
};

const EMAIL_DOMAIN_ROLE = {
  "@bscse.uiu.ac.bd": ROLE.STUDENT,
  "@cse.uiu.ac.bd": ROLE.FACULTY,
  "@gmail.com": ROLE.STAFF,
};

module.exports = {
  ROLE,
  EMAIL_DOMAIN_ROLE,
};