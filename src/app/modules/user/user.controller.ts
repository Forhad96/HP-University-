import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const handleCreateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;
    // const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await UserServices.createStudent(password, studentData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const handelCreateFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, faculty: facultyData } = req.body;
    const result = await UserServices.createFaculty(password, facultyData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty is created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const handelCreateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
try {
  const {password,admin:adminData} = req.body;
  const result = await UserServices.createAdmin(password,adminData)
  
  
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Admin created successfully",
    data:result
  })
} catch (error) {
  next(error)
}


};
export const UserControllers = {
  handleCreateStudent,
  handelCreateFaculty,
  handelCreateAdmin
};
