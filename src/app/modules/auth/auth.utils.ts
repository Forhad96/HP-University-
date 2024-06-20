import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {userId:string,role:string},
  secret: string,
  expiresIn: string,
) => {
    console.log(secret,expiresIn);
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
