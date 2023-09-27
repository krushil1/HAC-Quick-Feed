// Gpa.js
export const std_weight = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.67,
    "B+": 3.33,
    "B": 3.0,
    "B-": 2.67,
    "C+": 2.33,
    "C": 2.0,
    "C-": 1.67,
    "D": 1.0,
    "F": 0.0,
  };
  
  export const hnrs_weight = {
    "A+": 4.5,
    "A": 4.5,
    "A-": 4.17,
    "B+": 3.83,
    "B": 3.5,
    "B-": 3.17,
    "C+": 2.83,
    "C": 2.5,
    "C-": 2.17,
    "D": 1.0,
    "F": 0.0,
  };
  
  export const ap_weight = {
    "A+": 5.0,
    "A": 5.0,
    "A-": 4.67,
    "B+": 4.33,
    "B": 4.0,
    "B-": 3.67,
    "C+": 3.33,
    "C": 3.0,
    "C-": 2.67,
    "D": 1.0,
    "F": 0.0,
  };
  
  export function calculateHonorsStatus(gpa, data) {
    if (gpa >= 4.0 && !data.some((classInfo) => parseFloat(classInfo.grade) < 80)) {
      return "Distinguished Principal’s List";
    } else if (
      gpa >= 3.75 &&
      gpa <= 3.99 &&
      !data.some((classInfo) => parseFloat(classInfo.grade) < 70)
    ) {
      return "High Honors";
    } else if (
      gpa >= 3.25 &&
      gpa <= 3.74 &&
      !data.some((classInfo) => parseFloat(classInfo.grade) < 70)
    ) {
      return "Honors";
    } else {
      console.log("No honors status"); // Add this line for debugging
      return ""; // No honors status
    }
  }
  
  export function calculateGPA(data) {
    let totalQualityPoints = 0;
    let totalCredits = 0;
  
    data.forEach((classInfo) => {
      const { grade, category } = classInfo;
  
      // Check if the category is "Unknown" and skip this course
      if (category === "Unknown") {
        return;
      }
  
      let credits = 1; // Automatically set credits to 1 for each course
  
      // Convert percentage grade to letter grade
      let letterGrade = "F"; // Default to F
  
      if (grade !== "N/A") {
        const numericGrade = parseFloat(grade);
        if (numericGrade >= 97) letterGrade = "A+";
        else if (numericGrade >= 93) letterGrade = "A";
        else if (numericGrade >= 90) letterGrade = "A-";
        else if (numericGrade >= 87) letterGrade = "B+";
        else if (numericGrade >= 83) letterGrade = "B";
        else if (numericGrade >= 80) letterGrade = "B-";
        else if (numericGrade >= 77) letterGrade = "C+";
        else if (numericGrade >= 73) letterGrade = "C";
        else if (numericGrade >= 70) letterGrade = "C-";
        else if (numericGrade >= 60) letterGrade = "D";
      }
  
      // Define the course category weightings
      const categoryWeightings = {
        CP: std_weight,
        GHP: std_weight,
        HRS: hnrs_weight,
        AP: ap_weight,
      };
  
      // Add the corresponding quality points based on the grade and category
      if (category in categoryWeightings) {
        totalQualityPoints += categoryWeightings[category][letterGrade] * credits;
      } else {
        console.warn(
          `Category '${category}' not recognized. Using default weightings.`
        );
        totalQualityPoints += std_weight[letterGrade] * credits; // Default to standard weightings
      }
  
      // Increment total credits
      totalCredits += credits;
    });
  
    // Check if there are no courses with known categories (i.e., all courses are "Unknown")
    if (totalCredits === 0) {
      alert("No valid courses found for GPA calculation.");
      return;
    }
  
    // Calculate GPA
    const calculatedGPA = totalQualityPoints / totalCredits;
  
    return calculatedGPA;
  }
  