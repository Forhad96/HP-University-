import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    code: {
      type: String,
      required: true,
      enum: AcademicSemesterCode,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      required: true,
      enum: Months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: Months,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save middleware for the academicSemesterSchema.
 * This middleware checks if a semester with the same name and year already exists in the database.
 * If such a semester exists, it throws an error to prevent duplicate entries.
 * 
 * @param {Function} next - The next middleware function in the stack.
 * @throws {Error} If the semester already exists in the database.
 */
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await academicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  });
  if (isSemesterExist) throw new Error('Semester already exist');
  next();
});

export const academicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
