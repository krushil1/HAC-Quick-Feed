// Grades.js
export async function fetchGrades() {
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
  
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  