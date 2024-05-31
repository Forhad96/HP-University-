import { AcademicFacultyModel } from './academicFaculty.model';
import { TAcademicFaculty } from './academicFaculty.interface';

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};
const updateAcademicFaculty = async (
  semesterId: string,
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(
    semesterId,
    payload,
    { new: true },
  );
  // console.log(result);
  return result;
};

const getAllAcademicFaculties = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

const getSingleAcademicFaculty = async (semesterId: string) => {
  const result = await AcademicFacultyModel.findById(semesterId);
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
