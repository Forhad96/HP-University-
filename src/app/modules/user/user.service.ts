import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateStudentId } from './user.utils';
const createStudent = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  //find academic semester information
  const academicSemester = await academicSemesterModel.findById(
    payload.academicSemester,
  );

  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  //set generated it
  userData.id = await generateStudentId(academicSemester);

  // create a user
  const newUser = await UserModel.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //reference _id

    const newStudent = await StudentModel.create(payload);
    return newStudent;
  }
};

export const UserService = {
  createStudent,
};
