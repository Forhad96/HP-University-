import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await UserModel.isUserExisTByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  //checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  //checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  //checking if the password correct
  const isMatched = await UserModel.isPasswordMatched(payload?.password, user?.password)
  if (!isMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }
  //create token send to the client

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expired_in as string,
  });

  //   console.log(payload);
  //   const result = UserModel.find();
  return { accessToken, needsPasswordChange: user.needsPasswordChange };
};


const changePassword = async(payload)=>{
  
}


export const AuthServices = {
  loginUser,
  changePassword,
};
