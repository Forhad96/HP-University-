import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

//id will generate (year ,semesterCode ,4 digit number)
export const generateStudentId = (payload: TAcademicSemester) => {
  //id first time will 0000
  const currentId = (0).toString();
  let incrementId = (0 + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
