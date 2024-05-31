import httpStatus from 'http-status';

import catchAsync from '../../utils/cathAsync';
import { AcademicFacultyServices } from './academicFaculty.service';
import sendResponse from '../../utils/sendResponse';

const handleCreateAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.CreateAcademicFaculty(req.body);

  // sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is created successfully',
    data: result,
  });
});

const handleGetAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFaculties();
  // sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All academic semester retrieve successfully',
    data: result,
  });
});

const handleGetSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicFacultyServices.getSingleAcademicFaculty(semesterId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single academic semester retrieve successfully',
    data: result,
  });
});

const handleUpdateSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const updatedData = req.body;
  const result = await AcademicFacultyServices.updateAcademicFaculty(
    semesterId,
    updatedData,
  );
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single academic semester updated successfully',
    data: result,
  });
});

export const AcademicFacultyController = {
  handleCreateAcademicFaculty,
  handleGetAllAcademicFaculties,
  handleGetSingleAcademicFaculty,
  handleUpdateSingleAcademicFaculty,
};
