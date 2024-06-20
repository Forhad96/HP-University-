import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';

import AppError from '../errors/AppError';
import catchAsync from '../utils/cathAsync';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';
// import { UserModel } from '../modules/user/user.model';

const auth = (...requiredUserRoles :TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token valid or not
 jwt.verify(token, config.jwt_access_secret as string,function(err,decoded){
    if(err){
        throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized")
    }
const role = (decoded as JwtPayload).role;
if(requiredUserRoles &&  !requiredUserRoles.includes(role)){
  throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
}

        req.user = decoded as JwtPayload
        next()
 });


  });
};

export default auth;
