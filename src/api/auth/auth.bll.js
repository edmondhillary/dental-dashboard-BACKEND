import jwt from 'jsonwebtoken';
import { hashSync, compare, compareSync } from 'bcrypt';
import * as employeeRepository from '../repository/employeeRepo.js';

function getToken(user) {
  console.log('LA CONCHA SU MADRE TERMINE')
  const payload = {
    userId: user._id,
    email: user.email,
  role: user.role,
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

  const token = getToken({ email: dbUser.email, _id: dbUser._id,role: dbUser.role });
  if (!token) {
    throw new Error('Some problem generating token');
  }

  return token;
}

async function register({ email, password, gender, firstName, lastName, phone, dateOfBirth, address, role, dni, securityNamber, lastConnection }) {
  const hashedPassword = hashSync(password, 10);
  const dbUser = await employeeRepository.insert({ email, password: hashedPassword,  gender, firstName, lastName, phone, dateOfBirth, address, role, dni, securityNamber, lastConnection  });
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
