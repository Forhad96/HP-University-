import { Model } from "mongoose";
import { USER_ROLES } from "./user.constant";

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};


export interface UserStaticModel extends Model<TUser> {
isUserExisTByCustomId(id:string):Promise<TUser>;
isPasswordMatched(plainTextPassword:string,hashedPassword:string):Promise<boolean>;
}




export type TUserRoles = keyof typeof USER_ROLES;