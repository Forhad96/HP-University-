import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudents = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query }; // copying req.query object so that we can mutate the copy object

  // // search query functionality
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // const studentSearchableFields = ['email', 'name.firstName'];
  // const searchQuery = StudentModel.find({
  //   $or: studentSearchableFields.map(field => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // //filtering functionality
  // const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
  // excludeFields.forEach(el => delete queryObj[el]);

  // console.log('base', query);
  // console.log('copy', queryObj);
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('academicSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: 'academicFaculty',
  //   });

  // // SORTING FUNCTIONALITY:

  // let sort = '-createdAt'; // SET DEFAULT VALUE

  // // IF sort  IS GIVEN SET IT

  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);

  // // PAGINATION FUNCTIONALITY:

  // let page = 1; // SET DEFAULT VALUE FOR PAGE
  // let limit = 1; // SET DEFAULT VALUE FOR LIMIT
  // let skip = 0; // SET DEFAULT VALUE FOR SKIP

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery =  paginateQuery.limit(limit);

  // // FIELDS LIMITING FUNCTIONALITY:

  // // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH

  // fields: 'name,email'; // WE ARE ACCEPTING FROM REQUEST
  // fields: 'name email'; // HOW IT SHOULD BE

  // let fields = '-__v'; // SET DEFAULT VALUE

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // const result = await StudentModel.find()
  //   .populate('academicSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: 'academicFaculty',
  //   });
  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    StudentModel.find().populate('academicSemester').populate({
      path: 'academicDepartment',
      populate: 'academicFaculty',
    }),
    query,
  ).search(studentSearchableFields).filter().sort().pagination().fields();


  const result = await studentQuery.modelQuery
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id }).populate("user")
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
    ...remainingStudentData,
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

  const result = await StudentModel.findOneAndUpdate(
    { id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
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
