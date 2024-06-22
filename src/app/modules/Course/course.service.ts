import QueryBuilder from '../../builder/QueryBuilder';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import { CourseSearchableFields } from './course.constant';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourse = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();
  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal()
  return {
    meta,
    result
  };
};

const getSingleCourse = async (id: string) => {
  const result = await CourseModel.findById(id);
  return result;
};
/**
 * Updates a course by its ID with new data provided in the payload.
 * This function handles both basic course information updates and updates to its pre-requisite courses.
 * 
 * @param {string} id - The unique identifier of the course to update.
 * @param {Partial<TCourse>} payload - An object containing the course data to update. This can be a partial
 *                                     representation of the course object, including any pre-requisite courses.
 * @returns {Promise<TCourse>} - Returns a promise that resolves with the updated course document.
 * @throws {AppError} - Throws an error if the update operation fails at any step.
 */
const updateCourse = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Step 1: Update basic course information
    const updatedBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
    }

    // Step 2: Check and update any pre-requisite courses if provided
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // Filter out and delete pre-requisite courses marked as deleted
      const deletedPreRequisites = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course);

      const deletedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }

      // Filter out and add new pre-requisite courses
      const newPreRequisites = preRequisiteCourses.filter(
        el => el.course && !el.isDeleted,
      );
      const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }
    }

    // Commit transaction and end session
    await session.commitTransaction();
    await session.endSession();

    // Fetch and return the fully updated course document
    const result = await CourseModel.findById(id).populate('preRequisiteCourses.course');
    return result;
  } catch (error) {
    // Abort transaction and end session on error
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
  }
};
const deleteCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(id);
  return result;
};
const assignFacultiesWithCourse = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};


const removeFacultiesFromCourse = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};
export const CourseServices = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse
};
