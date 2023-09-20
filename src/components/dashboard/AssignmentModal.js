import React from "react";

function AssignmentModal({ classData, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <div className="z-50 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-screen-lg w-full h-screen md:max-h-screen-md overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-indigo-500">
            {classData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Assignment
              </th>
              <th scope="col" className="px-6 py-3">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3">
                Score
              </th>
              <th scope="col" className="px-6 py-3">
                Total Points
              </th>
            </tr>
          </thead>
          <tbody>
            {classData.assignments.map((assignment, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    : "bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700"
                }
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {assignment.assignment}
                </td>
                <td className="px-6 py-4">{assignment.dateDue}</td>
                <td className="px-6 py-4">{assignment.score}</td>
                <td className="px-6 py-4">{assignment.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignmentModal;
