const userRepository = require("../repository/user.repository");

const getOrCreateUser = async (firebaseUser) => {
  const { uid, email, name, picture, role } = firebaseUser;

  // 1. Check whether the user already exists
  const existingUser = await userRepository.getUserById(uid);

  // 2. Existing user → preserve their Firestore role
  if (existingUser) {
    return existingUser;
  }

  // 3. First login → create user with the role
  // determined by the authentication middleware
  const userData = {
    uid,
    name: name || null,
    email,
    role: role || null,
    photoURL: picture || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 4. Save user in Firestore
  return await userRepository.createUser(uid, userData);
};

module.exports = {
  getOrCreateUser,
};