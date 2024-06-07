import express from 'express';

import { updateFacultyValidationSchema } from './faculty.validation';
import validateRequest from '../../middleware/validateRequest';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

router.get('/:id', FacultyControllers.handleGetSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.handleUpdateFaculty,
);

router.delete('/:id', FacultyControllers.handleDeleteFaculty);

router.get('/', FacultyControllers.handleGetAllFaculties);

export const FacultyRoutes = router;
