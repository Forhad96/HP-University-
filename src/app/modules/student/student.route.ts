import express from 'express'
import { StudentControllers } from './student.controller';


const router  = express.Router()


//will call controller function

// get all student 
router.get('/',StudentControllers.handleGetAllStudents)






export const studentRoutes = router;