import express from 'express';

import { updateFacultyValidationSchema } from './faculty.validation';
import validateRequest from '../../middleware/validateRequest';
import { FacultyControllers } from './faculty.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get('/:id', FacultyControllers.handleGetSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.handleUpdateFaculty,
);

router.delete('/:id', FacultyControllers.handleDeleteFaculty);

router.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  FacultyControllers.handleGetAllFaculties,
);

export const FacultyRoutes = router;
