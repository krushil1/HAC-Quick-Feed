import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import GpaModal from "./GpaModal";
import AssignmentModal from "./AssignmentModal";
import { calculateGPA, calculateHonorsStatus, std_weight, hnrs_weight, ap_weight } from "./Gpa";
import { fetchGrades } from "./Grades";
import Signout from "../Auth/Signout";

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isGPAModalOpen, setIsGPAModalOpen] = useState(false);
  const [gpa, setGPA] = useState(null);
  const [honorsStatus, setHonorsStatus] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define the closeModal function
  const closeModal = () => {
    setSelectedClass(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const gradesData = await fetchGrades();
        setData(gradesData);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openModal = (classData) => {
    setSelectedClass(classData);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const getColorClass = (grade) => {
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
  };

  const calculateGPAAndOpenModal = () => {
    const calculatedGPA = calculateGPA(data);
    const honorsStatusResult = calculateHonorsStatus(calculatedGPA, data);

    setGPA(calculatedGPA);
    setHonorsStatus(honorsStatusResult);
    setIsGPAModalOpen(true);
  };

  return (
    <div className="bg-slate-900 min-h-screen relative">
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="container mx-auto grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 content-around">
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
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-10">
        <div
          className={`flex items-center justify-center p-2 bg-indigo-500 text-white rounded-full cursor-pointer transition-transform ease-in-out duration-300 transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faCog} className="text-xl" />
        </div>
        {isMenuOpen && (
          <div className="menu-buttons absolute bottom-12 right-4">
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
              onClick={calculateGPAAndOpenModal}
            >
              Calculate GPA
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-2"
              onClick={Signout}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {selectedClass && (
        <AssignmentModal classData={selectedClass} onClose={closeModal} />
      )}

      {isGPAModalOpen && (
        <GpaModal title="GPA and Honors Status" onClose={() => setIsGPAModalOpen(false)}>
          {gpa !== null ? (
            <div>
              <p>Your GPA for these courses is: {gpa.toFixed(2)}</p>
              <p>Honors Status: {honorsStatus || "N/A"}</p>
            </div>
          ) : (
            <p>GPA calculation is in progress...</p>
          )}
        </GpaModal>
      )}
    </div>
  );
}

export default Dashboard;
