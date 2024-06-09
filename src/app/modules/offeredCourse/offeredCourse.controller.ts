import { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/cathAsync';
import { OfferedCourseServices } from './offeredCourse.service';


const handleCreateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourse(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is created successfully !',
    data: result,
  });
});

const handleGetAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  //   const result =
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'OfferedCourses retrieved successfully !',
  //     data: result,
  //   });
});

const handleGetSingleOfferedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    //   const result =
    //   sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: 'OfferedCourse fetched successfully',
    //     data: result,
    //   });
  },
);

const handleUpdateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCourse(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourse updated successfully',
    data: result,
  });
});

const handleDeleteOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourse(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse deleted successfully',
      data: result,
    });
  },
);

export const OfferedCourseControllers = {
   handleCreateOfferedCourse,
   handleGetAllOfferedCourses,
   handleGetSingleOfferedCourses,
   handleUpdateOfferedCourse,
   handleDeleteOfferedCourse,
};
