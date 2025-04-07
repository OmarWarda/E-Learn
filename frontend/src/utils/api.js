const API_URL = "http://localhost:3000/api/courses";

export const getInstructorCourses = async (instructorId) => {
  const res = await fetch(`${API_URL}/instructor/${instructorId}`);
  return res.json();
};

export const filterCourses = async (instructorId, subject, price) => {
  const query = new URLSearchParams({ subject, price }).toString();
  const res = await fetch(
    `${API_URL}/instructor/${instructorId}/filter?${query}`
  );
  return res.json();
};

export const searchCourses = async (instructorId, query) => {
  const res = await fetch(
    `${API_URL}/instructor/${instructorId}/search?q=${query}`
  );
  return res.json();
};

export const createCourse = async (courseData) => {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  return res.json();
};
