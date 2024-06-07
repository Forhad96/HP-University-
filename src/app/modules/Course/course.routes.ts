import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './couse.controller';

const router = Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.handleCreateCourse,
);

router.get('/',CourseControllers.handleGetAllCourses)

router.get('/:id',CourseControllers.handleGetSingleCourse)



export const CourseRoutes = router;
