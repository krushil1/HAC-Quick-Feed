import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import Modal from "./Modal"; // Import Modal component
import AssignmentModal from "./AssignmentModal"; // Make sure to import your AssignmentModal component

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isGPAModalOpen, setIsGPAModalOpen] = useState(false);
  const [gpa, setGPA] = useState(null);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_GET_GRADED_API}auth=${token}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      const formattedData = responseData.currentClasses.map((classInfo) => ({
        name: classInfo.name.substring(11),
        grade:
          classInfo.grade && classInfo.grade !== "Overall Average n/a"
            ? `${classInfo.grade.replace("Overall Average ", "")}%`
            : "N/A",
        last_updated: classInfo["Last Updated"] || "N/A",
        assignments: classInfo.assignments,
        category: classInfo.name.endsWith("AP")
          ? "AP"
          : classInfo.name.endsWith("CP") || classInfo.name.endsWith("GHP")
          ? "CP"
          : classInfo.name.endsWith("HRS")
          ? "HRS"
          : "Unknown",
      }));

      setData(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to open the modal when a class is clicked
  const openModal = (classData) => {
    setSelectedClass(classData);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedClass(null);
  };

  const handleSignout = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirect to the sign-in page
  };

  const std_weight = {
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

  const hnrs_weight = {
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

  const ap_weight = {
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

  const calculateGPA = () => {
    let totalQualityPoints = 0;
    let totalCredits = 0;

    data.forEach((classInfo) => {
      const { grade, category } = classInfo;
      console.log(grade, category);
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
        totalQualityPoints +=
          categoryWeightings[category][letterGrade] * credits;
      } else {
        console.warn(
          `Category '${category}' not recognized. Using default weightings.`
        );
        totalQualityPoints += std_weight[letterGrade] * credits; // Default to standard weightings
      }

      // Increment total credits
      totalCredits += credits;
    });

    // Calculate GPA
    const calculatedGPA = totalQualityPoints / totalCredits;

    // Set the GPA in state
    setGPA(calculatedGPA);

    // Open the GPA modal
    setIsGPAModalOpen(true);
  };

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center items-center">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <InfinitySpin width="200" color="#6365f1" />
        </div>
      ) : error ? (
        <div className="text-white text-center font-bold">
          Error: {error} <br />
          Try refreshing
        </div>
      ) : (
        <div className="container md:mx-auto grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 content-around">
          {data.map((classInfo, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => openModal(classInfo)}
            >
              <div className="block md:p-14 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center p-4 sm:col-span-1">
                <h4 className="mb-2 sm:text-sm md:text-xl lg:text-xl font-bold tracking-tight text-gray-900 dark:text-indigo-500">
                  {classInfo.name}
                </h4>
                <p
                  className={`font-semibold sm:text-xs md:text-xl md:mt-2 lg:mt-2 ${getColorClass(
                    classInfo.grade
                  )} dark:text-gray-400`}
                >
                  {classInfo.grade}
                </p>
                <p className="font-normal sm:text-base mt-2 text-gray-700 dark:text-gray-400">
                  Last Updated: {classInfo.last_updated}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="fixed bottom-4 font-bold right-4 p-2 bg-red-500 text-white rounded-xl"
        onClick={handleSignout}
      >
        Sign Out
      </button>
      {selectedClass && (
        <AssignmentModal classData={selectedClass} onClose={closeModal} />
      )}

      {/* Calculate GPA button */}
      <button
        className="fixed bottom-4 right-4 p-2 bg-indigo-500 text-white rounded-xl"
        onClick={calculateGPA}
      >
        Calculate GPA
      </button>

      {/* GPA Modal */}
      {isGPAModalOpen && (
        <Modal title="GPA Calculation" onClose={() => setIsGPAModalOpen(false)}>
          {gpa !== null ? (
            <div>
              <p>Your GPA for these courses is: {gpa.toFixed(2)}</p>
            </div>
          ) : (
            <p>GPA calculation is in progress...</p>
          )}
        </Modal>
      )}
    </div>
  );
}

// Function to determine the color class based on the grade
function getColorClass(grade) {
  // Use regular expression to extract the numeric part of the grade
  const numericGradeMatch = grade.match(/(\d+(\.\d+)?)/);

  if (numericGradeMatch) {
    const numericGrade = parseFloat(numericGradeMatch[0]);

    if (numericGrade < 50) {
      return "dark:text-red-400"; // Red for grades below 50%
    } else if (numericGrade < 70) {
      return "dark:text-orange-300"; // Orange for grades between 50% and 69%
    } else if (numericGrade < 90) {
      return "dark:text-yellow-300"; // Yellow for grades between 70% and 89%
    } else {
      return "dark:text-green-400"; // Green for grades between 90% and 100%
    }
  } else {
    return "dark:text-gray-300"; // Default color for N/A grades or invalid grades
  }
}

export default Dashboard;
