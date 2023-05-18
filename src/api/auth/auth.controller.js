import * as authBll from './auth.bll.js';
import jwt from 'jsonwebtoken';


function unauthorized(response) {
  response.status(401);
  response.send('Unauthorized, you are not allow to access this route, ask for permissions ');
}

async function login(req, res) {
  const { email, password } = req.body;
  let token;

  if (!email || !password) {
    res.status(400); // Bad request
    res.send('Empty required params');
    return;
  }

  try {
    token = await authBll.login({ email, password });
  } catch(err) {
    res.status(err.status);
    res.send(err.message);
  }

  res.json({ token });
}

async function register(req, res) {
  const { email, password, gender, firstName, lastName, phone, dateOfBirth, address, role, dni, securityNumber, lastConnection } = req.body;
  let token;

  if (!email || !password) {
    res.status(400);
    res.send('Empty required params');
    return;
  }

  try {
    token = await authBll.register({ email, password, gender, firstName, lastName, phone, dateOfBirth, address, role, dni, securityNumber, lastConnection });
  } catch(err) {
    console.log(err)
    res.status(500);
    res.send(err.message);
  }

  res.json({ token });
}
export function isAdmin(request, response, next) {
  const token = request.headers.authorization;
  if (!token) {
    return unauthorized(response);
  }

  jwt.verify(token, process.env.AUTH_SECRET_KEY, (error, payload) => {
    if (error) {
      console.error('ERROR!', error.message);
      return unauthorized(response);
    }

    const userRole = payload.role;

    if (userRole === 'admin' || userRole === 'superAdmin') {
      next();
    } else {
      return unauthorized(response);
    }
  });
}
export function isSuperAdmin(request, response, next) {
  const token = request.headers.authorization;
  if (!token) {
    return unauthorized(response);
  }

  jwt.verify(token, process.env.AUTH_SECRET_KEY, (error, payload) => {
    if (error) {
      console.error('ERROR!', error.message);
      return unauthorized(response);
    }

    if (payload.role !== 'superAdmin') {
      return unauthorized(response);
    }

    request.username = payload.username;
    request.userId = payload.userId;
    request.role = payload.role;

    next();
  });
}

export { login, register };
