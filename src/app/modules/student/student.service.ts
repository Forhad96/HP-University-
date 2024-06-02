import { StudentModel } from "./student.model";



const getAllStudents = async () => {
  const result = await StudentModel.find()
    .populate('academicSemester')
    .populate({
      path: 'academicDepartment',
      populate:"academicFaculty"
    });
  return result;
};

const getSingleStudent = async (id: string) => {
 const result = await StudentModel.findById(id)
   .populate('academicSemester')
   .populate({
     path: 'academicDepartment',
     populate: 'academicFaculty',
   });;
  return result;
};


const deleteStudent = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true });
  return result;
};


export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudent
};
