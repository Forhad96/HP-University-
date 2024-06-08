import express from 'express';

import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.handleCreateSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationController.handleGetSingleSemesterRegistration,
);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.handleUpdateSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationController.handleGetSingleSemesterRegistration,
);

router.delete(
  '/:id',
  SemesterRegistrationController.handleDeleteSemesterRegistration,
);

router.get(
  '/',
  SemesterRegistrationController.handleGetAllSemesterRegistrations,
);

export const semesterRegistrationRoutes = router;
