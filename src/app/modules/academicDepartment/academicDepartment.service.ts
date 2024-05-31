import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartmentModel.create(payload);
  return result;
};

const getAllAcademicDepartment = async () => {
  const result = await AcademicDepartmentModel.find();
  return result;
};
const getSingleAcademicDepartment = async (departmentId:string) => {
  const result = await AcademicDepartmentModel.findById(departmentId);
  return result;
};
const updateAcademicDepartment = async (departmentId:string,payload:TAcademicDepartment) => {
  const result = await AcademicDepartmentModel.findByIdAndUpdate(departmentId,payload,{new:true});
  return result;
};

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
