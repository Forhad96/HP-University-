import { Router } from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-academic-semester',

  auth("admin","superAdmin"),
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.handleCreateAcademicSemester,
);

router.get('/',AcademicSemesterController.handleGetAllAcademicSemester)

router.get('/:semesterId',AcademicSemesterController.handleGetSingleAcademicSemester)

router.patch('/:semesterId',validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidationSchema),AcademicSemesterController.handleUpdateSingleAcademicSemester)

export const AcademicSemesterRoutes = router;
