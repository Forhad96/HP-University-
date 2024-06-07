import httpStatus from "http-status";
import catchAsync from "../../utils/cathAsync";
import { CourseServices } from "./course.service";
import sendResponse from "../../utils/sendResponse";

const handleCreateCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const handleGetAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourses(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course are retrieved successfully',
    data: result,
  });
});

const handleGetSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourse(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  });
});

const handleUpdateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourse(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course is updated successfully',
    data: result,
  });
});

const handleDeleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourse(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

export const CourseControllers = {
    handleCreateCourse,
    handleGetAllCourses,
    handleGetSingleCourse,
    handleUpdateCourse,
    handleDeleteCourse,
}