import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegistration = async (payload: TSemesterRegistration) => {
  const academicSemesterId = payload.academicSemester;
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

const getAllSemesterRegistrations = async (
  query: Record<string, unknown>,
) => {};

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
