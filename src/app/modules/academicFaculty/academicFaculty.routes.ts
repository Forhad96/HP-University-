import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { FacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';



const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    FacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.handleCreateAcademicFaculty,
);

router.get('/', AcademicFacultyController.handleGetAllAcademicFaculties);

router.get(
  '/:facultyId',
  AcademicFacultyController.handleGetSingleAcademicFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(
    FacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.handleUpdateSingleAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
