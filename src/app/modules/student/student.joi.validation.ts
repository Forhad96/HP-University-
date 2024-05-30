import Joi from 'joi';

// Define the Joi schema for UserName
const userNameSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First Name is required',
  }),
  middleName: Joi.string().optional(),
  lastName: Joi.string()
    .required()
    .messages({
      'any.required': 'Last Name is required',
      'string.pattern.base': "Last Name isn't valid",
    })
    .pattern(/^[A-Za-z]+$/),
});

// Define the Joi schema for Guardian
const guardianSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'any.required': 'Father Name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'any.required': 'Father Occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'any.required': 'Father Contact Number is required',
  }),
  motherName: Joi.string().required().messages({
    'any.required': 'Mother Name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'any.required': 'Mother Occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'any.required': 'Mother Contact Number is required',
  }),
});

// Define the Joi schema for LocalGuardian
const localGuardianSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Local Guardian Name is required',
  }),
  occupation: Joi.string().required().messages({
    'any.required': 'Local Guardian Occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'Local Guardian Contact Number is required',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Local Guardian Address is required',
  }),
});

// Define the Joi schema for Student
const studentSchema = Joi.object({
  id: Joi.string().optional(),
  name: userNameSchema.required(),
  gender: Joi.string().valid('male', 'female').required().messages({
    'any.only': 'Gender must be either male or female',
    'any.required': 'Gender is required',
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'Contact Number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'any.required': 'Emergency Contact Number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only':
        'Blood Group must be one of [A+, A-, B+, B-, AB+, AB-, O+, O-]',
    }),
  presentAddress: Joi.string().required().messages({
    'any.required': 'Present Address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'any.required': 'Permanent Address is required',
  }),
  guardian: guardianSchema.required(),
  localGuardian: localGuardianSchema.required(),
  profileImg: Joi.string().optional(),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': 'Status must be either active or blocked',
  }),
});

// Export the Joi schema
export const validateStudentJoi= (student: any) =>
  studentSchema.validate(student, { abortEarly: false });
// use this controller where user will send you data;

// creating a schema validation using joi
// const {value ,error} =validateStudentJoi(student)
// you can sent error by res.status(400).json({})

// console.log({value},{error});