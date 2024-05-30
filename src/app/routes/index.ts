import { Router } from 'express';
import { studentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    routes: UserRoutes,
  },
  {
    path: '/users',
    routes: studentRoutes,
  },
  {
    path: '/academic-semester',
    routes: AcademicSemesterRoutes,
  },
];

/**
 * Iterates over each route in moduleRoutes and registers it with the router.
 * @param {Array} moduleRoutes - An array of route objects that each contain a path and routes.
 */
moduleRoutes.forEach(route => router.use(route.path, route.routes));

export default router;
