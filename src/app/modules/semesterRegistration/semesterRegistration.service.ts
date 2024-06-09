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
) => {
  /**
   * Step1: Check if the semester is exist
   * Step2: Check if the requested registered semester is exists
   * Step3: If the requested semester registration is ended, we will not update anything
   * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
   * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
   * Step6: If the requested semester registration is 'ENDED' , we will not update anything
   *
   * UPCOMING --> ONGOING --> ENDED
   *
   */
  // check if semester exist
  // check if the requested registered semester is exists
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found');
  }
  //If the requested semester registration is end,will not update anything
  const currentSemesterStatus = isSemesterRegistrationExist?.status;
  const requestedStatus = payload.status;

  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${isSemesterRegistrationExist?.status}`,
    );
  }

  // UPCOMING --> ONGOING --> ENDED
  if (currentSemesterStatus === 'UPCOMING' && requestedStatus === 'ENDED')
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );

  if (currentSemesterStatus === 'ONGOING' && requestedStatus === 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteSemesterRegistration = async (id: string) => {};

export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
