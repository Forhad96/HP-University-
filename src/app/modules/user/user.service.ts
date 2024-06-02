import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

const createStudent = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

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

export const UserService = {
  createStudent,
};
