import { Router } from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.CreateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.handleCreateAcademicSemester,
);

router.get('/',AcademicSemesterController.handleGetAllAcademicSemester)

router.get('/:semesterId',AcademicSemesterController.handleGetSingleAcademicSemester)

router.patch('/:semesterId',validateRequest(academicSemesterValidations.UpdateAcademicSemesterValidationSchema),AcademicSemesterController.handleUpdateSingleAcademicSemester)

export const AcademicSemesterRoutes = router;
