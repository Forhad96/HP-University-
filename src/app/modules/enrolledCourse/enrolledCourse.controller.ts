import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const handleCreateEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourse(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is enrolled successfully',
    data: result,
  });
});

const handleUpdateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarks(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update enrolled course successful',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  handleCreateEnrolledCourse,
  handleUpdateEnrolledCourseMarks,
};
