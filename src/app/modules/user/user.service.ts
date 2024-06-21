import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { TFaculty } from '../Faculty/faculty.interface';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { FacultyModel } from '../Faculty/faculty.model';
import { AdminModel } from '../Admin/admin.model';

const createStudent = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';
  // set student email 
  userData.email = payload.email

  // find academic semester information
  const academicSemester = await academicSemesterModel.findById(
    payload.academicSemester,
  );

  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // set generated id
    userData.id = await generateStudentId(academicSemester);

    // create a user
    const newUser = await UserModel.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    const newStudent = await StudentModel.create([payload], { session });

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err; // rethrow the error after cleanup
  }
};
const createFaculty = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';
  // set faculty email
  userData.email = payload.email;
  // find academic department info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await FacultyModel.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: unknown) {
    await session.abortTransaction();
    await session.endSession();
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

const createAdmin = async (password: string, payload: TFaculty) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';

  // set admin email
  userData.email = payload.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //set generated id
    userData.id = await generateAdminId();
    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    // create a admin (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to created admin');
    }

    // session end
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err: unknown) {
    await session.abortTransaction();
    await session.endSession();
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

const getMe = async(userId: string,role:string) => {
let result = null;
if (role === 'student') {
  result = await StudentModel.findOne({ id: userId }).populate('user');
}
if (role === 'admin') {
  result = await AdminModel.findOne({ id: userId }).populate('user');
}

if (role === 'faculty') {
  result = await FacultyModel.findOne({ id: userId }).populate('user');
}

return result;
};

const changeStatus = async (userId:string ,payload:{status:string})=>{
  console.log(userId,payload);
  const result = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
  });
  return result;
}
export const UserServices = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus
};
