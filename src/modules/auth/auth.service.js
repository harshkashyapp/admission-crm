const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repo = require('./auth.repository');

const register = async ({ name, email, password, role }) => {
  const existing = await repo.findUserByEmail(email);
  if (existing) throw { status: 409, message: 'Email already registered' };

  const passwordHash = await bcrypt.hash(password, 10);
  return repo.createUser({ name, email, passwordHash, role });
};

const login = async ({ email, password }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { register, login };