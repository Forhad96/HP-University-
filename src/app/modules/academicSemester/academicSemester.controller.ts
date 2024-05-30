import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AcademicSemesterServices } from './academicSemester.service';
import catchAsync from '../../utils/cathAsync';

const handleCreateAcademicSemester = catchAsync(async (req,res) => {
    const result = await AcademicSemesterServices.CreateAcademicSemester(req.body);

    // sent response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester is created successfully',
      data: result,
    });

})

const handleGetAllAcademicSemester = catchAsync(async (req,res)=>{
  const result = await AcademicSemesterServices.getAllAcademicSemester();
  // sent response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All academic semester retrieve successfully',
    data: result,
  });
})

const handleGetSingleAcademicSemester = catchAsync(async (req,res )=>{
  const {semesterId} = req.params
  const result = await AcademicSemesterServices.getSingleAcademicSemester(semesterId)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single academic semester retrieve successfully',
      data: result,
    });
})

const handleUpdateSingleAcademicSemester = catchAsync(async (req,res)=>{
  const {semesterId} = req.params;
  const updatedData = req.body;
  const result =await AcademicSemesterServices.updateAcademicSemester(semesterId,updatedData)
  console.log(result);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single academic semester updated successfully',
        data: result,
      });
})

export const AcademicSemesterController = {
handleCreateAcademicSemester,
handleGetAllAcademicSemester,
handleGetSingleAcademicSemester,
handleUpdateSingleAcademicSemester,
};
