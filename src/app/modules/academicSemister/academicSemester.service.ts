import { AcademicSemesterCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';

/**
 * Asynchronously creates an academic semester entry in the database.
 * 
 * @param {TAcademicSemester} payload - The academic semester data to be created.
 * @throws {Error} Throws an error if the semester code does not match the expected code for the given semester name.
 */
const CreateAcademicSemester = async (payload: TAcademicSemester) => {
  if (AcademicSemesterCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid Semester Code");
  }

  const result = await academicSemesterModel.create(payload);
  return result
};
const updateAcademicSemester = async (semesterId:string ,payload: TAcademicSemester) => {
  if (payload.name && payload.code && AcademicSemesterCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid Semester Code");
  }

  const result = await academicSemesterModel.findByIdAndUpdate(semesterId,payload,{new:true});
  // console.log(result);
  return result
};



const getAllAcademicSemester = async () =>{
  const result = await academicSemesterModel.find()
  return result
}


const getSingleAcademicSemester = async (semesterId:string)=>{
  const result = await academicSemesterModel.findById(semesterId)
  return result
}

export const AcademicSemesterServices = {
  CreateAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
