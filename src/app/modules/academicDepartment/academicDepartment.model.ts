import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const AcademicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  { timestamps: true },
);



/**
 * Pre-save middleware for AcademicDepartmentSchema.
 * Checks if a department with the same name already exists in the database before saving a new department.
 * If the department exists, it throws an error; otherwise, it proceeds with saving the new department.
 *
 * @param {Function} next - The next middleware function in the stack.
 */
// AcademicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartmentModel.findOne({
//     name: this.name,
//   });
//   if (isDepartmentExist) throw new AppError(httpStatus.NOT_FOUND,'This Department already exist');
//   next();
// });

AcademicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const departmentId = this.getQuery();

  const isDepartmentExist =
    await AcademicDepartmentModel.findById(departmentId);
  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND,'This Department dose not exist');
  }

  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  AcademicDepartmentSchema,
);
