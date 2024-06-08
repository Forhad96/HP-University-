import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistration = async (payload: TSemesterRegistration) => {
  /**
   * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
   * Step2: Check if the semester is exist
   * Step3: Check if the semester is already registered!
   * Step4: Create the semester registration
   */
  const academicSemesterId = payload.academicSemester;
  //Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already and ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }
  //check if the semester already exists or not
  const isSemesterExist =
    await academicSemesterModel.findById(academicSemesterId);
  if (!isSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester is  not exist',
    );
  }
  // check if the semester already registered
  const isSemesterRegistrationExist = await SemesterRegistrationModel.findOne({
    academicSemester: academicSemesterId,
  });
  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This semester is already registered',
    );
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

const getAllSemesterRegistrations = async (query: Record<string, unknown>) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .pagination()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistration = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id);

  return result;
};

const updateSemesterRegistration = async (
  id: string,
  payload: TSemesterRegistration,
) => {};

const deleteSemesterRegistration = async (id: string) => {};

export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
