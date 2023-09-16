import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }));

      setData(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call the fetchData function
  }, []);

  const handleSignout = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirect to the sign-in page
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
            <a
              key={index}
              href="#"
              className="block md:p-14 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center p-4 sm:col-span-1"
            >
              <h4 className="mb-2 sm:text-sm md:text-xl lg:text-xl font-bold tracking-tight text-gray-900 dark:text-indigo-500">
                {classInfo.name}
              </h4>
              {classInfo.grade !== "N/A" && (
                <p className="font-semibold sm:text-xs md:text-xl md:mt-2 lg:mt-2 text-gray-700 dark:text-gray-400">
                  {classInfo.grade}
                </p>
              )}
              <p className="font-normal sm:text-base mt-2 text-gray-700 dark:text-gray-400">
                Last Updated: {classInfo.last_updated}
              </p>
            </a>
          ))}
        </div>
      )}
      <button
        className="fixed bottom-4 font-bold right-4 p-2 bg-red-500 text-white rounded-xl"
        onClick={handleSignout}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Dashboard;
