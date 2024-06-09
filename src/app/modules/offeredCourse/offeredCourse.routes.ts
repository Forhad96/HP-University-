import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router.get('/', OfferedCourseControllers.handleGetAllOfferedCourses);

router.get('/:id', OfferedCourseControllers.handleGetSingleOfferedCourses);

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.handleCreateOfferedCourse,
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.handleUpdateOfferedCourse,
);

router.delete('/:id', OfferedCourseControllers.handleDeleteOfferedCourse);

export const offeredCourseRoutes = router;
