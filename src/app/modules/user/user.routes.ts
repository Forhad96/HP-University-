import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { createStudentValidationSchema } from '../student/student.zod.validation';
import { FacultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLES } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendingImageToCloudinary';
const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLES.admin,USER_ROLES.superAdmin),
  upload.single('file'),
  ((req:Request,res:Response,next:NextFunction)=>{
req.body = JSON.parse(req.body.data)
next()
  }),
  validateRequest(createStudentValidationSchema),
  UserControllers.handleCreateStudent,
);
router.post(
  '/create-faculty',
  auth(USER_ROLES.admin),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.handelCreateFaculty,
);

router.post("/create-admin",validateRequest(AdminValidations.createAdminValidationSchema),UserControllers.handelCreateAdmin)
router.post("/change-status/:userId",validateRequest(UserValidation.statusValidationSchema),UserControllers.handleChangeStatus)
router.get('/me',auth('admin','student','faculty'),UserControllers.handleGetMe)
export const UserRoutes = router;
