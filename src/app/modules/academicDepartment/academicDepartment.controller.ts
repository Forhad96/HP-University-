import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentService } from './academicDepartment.service';

const handleCreateAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.createAcademicDepartment(
    req.body,
  );

  //   sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department created successfully',
    data: result,
  });
});
const handleGetAllAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.getAllAcademicDepartment();

  //   sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All academic department retrieve successfully',
    data: result,
  });
});
const handleGetSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentService.getSingleAcademicDepartment(departmentId);

  //   sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single academic department retrieve successfully',
    data: result,
  });
});
const handleUpdateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const departmentData = req.body;
  const result =
    await AcademicDepartmentService.updateAcademicDepartment(departmentId,departmentData);

  //   sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update single academic department successfully',
    data: result,
  });
});

export const AcademicDepartmentController = {
  handleCreateAcademicDepartment,
  handleGetAllAcademicDepartment,
  handleGetSingleAcademicDepartment,
  handleUpdateAcademicDepartment,
};
