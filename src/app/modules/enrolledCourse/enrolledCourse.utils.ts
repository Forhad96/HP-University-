export const calculateGradeAndPoints = (totalMarks: number) => {
  /**
   * 0-19 F
   * 20-39 D
   * 40-59 C
   * 60-79 B
   * 80-100 A
   */
  if (totalMarks >= 0 && totalMarks <= 19) {
    return { grade: 'F', gradePoints: 0.0 };
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    return { grade: 'D', gradePoints: 2.0 };
  } else if (totalMarks >= 40 && totalMarks <= 59) {
    return { grade: 'C', gradePoints: 3.0 };
  } else if (totalMarks >= 60 && totalMarks <= 79) {
    return { grade: 'B', gradePoints: 3.5 };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    return { grade: 'A', gradePoints: 4.0 };
  } else {
    return { grade: 'NA', gradePoints: 0 };
  }
};
