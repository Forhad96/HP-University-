import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { updateStudentValidationSchema } from './student.zod.validation';

const router = express.Router();

//will call controller function

// get all student
router.get('/', StudentControllers.handleGetAllStudents);
router.get('/:studentId', StudentControllers.handleGetSingleStudent);
router.patch(
  '/:studentId',
  validateRequest(updateStudentValidationSchema),
  StudentControllers.handleUpdateStudent,
);
router.delete('/:studentId', StudentControllers.handleDeleteStudent);

export const studentRoutes = router;
