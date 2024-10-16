import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if(!token) {
    return next(errorHandler(401, "Access denied. No token provided."));
  }
  jwt.verify(token, process.env.JWT_SECRET,(err, user) => {
    if(err){
      next(err);
    }
    req.user = user;
  })
  next();
}