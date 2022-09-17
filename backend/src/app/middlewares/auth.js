/*
  File to create and process tokens and to store the user's id (that
is inside the token) into Sessions' requests
*/
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // if the session is not created
  // we won't find any authorization token
  // then, the application will not allow some routes
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  // else, we try to decode the token
  // and add the user id inside the requisition
  const [, token] = authHeader.split(' ');

  try {
    // if the token is valid, the user's id is stored in the Session's
    // requisition
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token!' });
  }
};
