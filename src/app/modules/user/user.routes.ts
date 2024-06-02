import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { createStudentValidationSchema } from '../student/student.zod.validtion';
const router = Router();


router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserController.handleCreateStudent,
);


export const UserRoutes = router;
