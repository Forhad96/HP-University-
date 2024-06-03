import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudents = async () => {
  const result = await StudentModel.find()
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate: 'academicFaculty',
    });
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id })
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate: 'academicFaculty',
    });
  return result;
};
const updateStudent = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData
  };

 if (name && Object.keys(name).length) {
   for (const [key, value] of Object.entries(name)) {
     modifiedUpdatedData[`name.${key}`] = value;
   }
 }

 if (guardian && Object.keys(guardian).length) {
   for (const [key, value] of Object.entries(guardian)) {
     modifiedUpdatedData[`guardian.${key}`] = value;
   }
 }

 if (localGuardian && Object.keys(localGuardian).length) {
   for (const [key, value] of Object.entries(localGuardian)) {
     modifiedUpdatedData[`localGuardian.${key}`] = value;
   }
 }


  const result = await StudentModel.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudent = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete student');
    }
    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
