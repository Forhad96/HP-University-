import QueryBuilder from '../../builder/QueryBuilder';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';
import { CourseSearchableFields } from './couse.constant';

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
  return result;
};

const getSingleCourse = async (id: string) => {
  const result = await CourseModel.findById(id);
  return result;
};
const updateCourse = async (id: string, payload: Partial<TCourse>) => {
  const result = await CourseModel.findByIdAndUpdate(id);
  return result;
};
const deleteCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(id);
  return result;
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
