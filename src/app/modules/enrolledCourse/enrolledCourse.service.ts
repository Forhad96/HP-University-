/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { StudentModel } from '../student/student.model';
import EnrolledCourseModel from './enrolledCourse.model';
import { startSession } from 'mongoose';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from '../Course/course.model';
import { FacultyModel } from '../Faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const offeredCourseId = payload.offeredCourse;
  //check offered course is available or not
  const offeredCourse = await OfferedCourseModel.findById(offeredCourseId);
  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }
  // check max capacity
  if (offeredCourse.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Over the capacity');
  }
  //   find student by custom id
  const student = await StudentModel.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }
  // check student already enrolled this course
  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: offeredCourse?.semesterRegistration,
    offeredCourse: offeredCourseId,
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !');
  }
  //check total credit exceed maxCredit
  const course = await CourseModel.findById(offeredCourse.course);
  const currentCredit = course?.credits;

  const semesterRegistration = await SemesterRegistrationModel.findById(
    offeredCourse.semesterRegistration,
  ).select('maxCredit');
  const maxCredit = semesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: offeredCourse.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  //  total enrolled credits + new enrolled course credit > maxCredit
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits !',
    );
  }


  const session = await startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: offeredCourse.semesterRegistration,
          academicSemester: offeredCourse.academicSemester,
          academicFaculty: offeredCourse.academicFaculty,
          academicDepartment: offeredCourse.academicDepartment,
          offeredCourse: offeredCourse,
          course: offeredCourse.course,
          student: student._id,
          faculty: offeredCourse.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in this course !',
      );
    }
// update maxCapacity
    const maxCapacity = offeredCourse.maxCapacity;
    await OfferedCourseModel.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarks = async (userId:string,payload:Partial<TEnrolledCourse>)=>{
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found !',
    );
  }

  const isOfferedCourseExists = await OfferedCourseModel.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }
  const isStudentExists = await StudentModel.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }


  const faculty = await FacultyModel.findOne({ id: userId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const isCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden! !');
  }
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };
  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }
    if (courseMarks && Object.keys(courseMarks).length) {
      for (const [key, value] of Object.entries(courseMarks)) {
        modifiedData[`courseMarks.${key}`] = value;
      }
    }

    const result = await EnrolledCourseModel.findByIdAndUpdate(isCourseBelongToFaculty._id,modifiedData,{new:true})
    return result
}

export const EnrolledCourseServices = {
  createEnrolledCourse,
  updateEnrolledCourseMarks
};
