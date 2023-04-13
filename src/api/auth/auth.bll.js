import jwt from 'jsonwebtoken';
import { hashSync, compare, compareSync } from 'bcrypt';
import * as employeeRepository from '../repository/employeeRepo.js';

function getToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.AUTH_SECRET_KEY, {
    // expiresIn: 60 * 60 // in secs
    expiresIn: process.env.AUTH_EXPIRES_IN // string
  });

  return token;
}

async function login({ email, password }) {
  const dbUser = await employeeRepository.getByEmail({email});
  if (!dbUser) {
    throw new Error('Wrong credentials');
  }

  const isSamePassword = compareSync(password, dbUser.password);
  if (!isSamePassword) {
    throw new Error('Wrong credentials');
  }

  const token = getToken({ email: dbUser.email, _id: dbUser._id });
  if (!token) {
    throw new Error('Some problem generating token');
  }

  return token;
}

async function register({ email, password }) {
  const hashedPassword = hashSync(password, 10);
  const dbUser = await employeeRepository.insert({ email, password: hashedPassword });
  if (!dbUser) {
    throw new Error('Some problem at insert');
  }

  const token = getToken({ email : dbUser.email, _id: dbUser._id });
  if (!token) {
    throw new Error('Some problem generating token');
  }

  return token;
}

export { login, register };
