import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const base_url = window.__ENV__?.VITE_BACKEND_BASE_URL || "http://localhost:3005";
  console.log("API",base_url)

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState({ name: "", major: "", email: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const normalizeStudents = (payload) => {
    return Array.isArray(payload) ? payload : [];
  };
  
  const openPopup = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    getAllStudents();
    setStudentData({ name: "", major: "", email: "" });
    setErrorMsg("");
  };

  const getAllStudents = () => {
    axios.get(`${base_url}/students`).then((res) => {
      const safeStudents = normalizeStudents(res.data);
      setStudents(safeStudents);
      setFilteredStudents(safeStudents);
    }).catch((error) => {
      console.error("Error fetching students:", error);
      setStudents([]);
      setFilteredStudents([]);
    });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const source = normalizeStudents(students);
    const filteredData = source.filter(student =>
      student.name.toLowerCase().includes(searchValue) ||
      student.major.toLowerCase().includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue)
    );
    setFilteredStudents(filteredData);
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (student) => {
    setStudentData(student);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentData.name || !studentData.major || !studentData.email) {
      setErrorMsg("All fields are required!");
      return;
    }

    try {
      if (studentData.studentid) {
        // Update student
        await axios.patch(`${base_url}/students/${studentData.studentid}`, studentData);
      } else {
        // Add student
        await axios.post(`${base_url}/students`, studentData);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (studentId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this student?");
    if (isConfirmed) {
      try {
        await axios.delete(`${base_url}/students/${studentId}`);
        getAllStudents(); // Refresh list
      } catch (error) {
        console.error("Failed to delete student:", error);
        alert("Error deleting student. Please try again.");
      }
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <>
      <div className='std-container'>
        <h3>Full Stack Application using React JS, Nodejs & PostgreSQL</h3>

        {/* Search Box */}
        <div className='search-box'>
          <input
            className='search-input'
            onChange={handleSearch}
            type="search"
            name="searchinput"
            id="searchinput"
            placeholder='Search Student Here'
          />
          <button className='addBtn addeditcolor' onClick={openPopup}>Add</button>
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
          <div className='addeditpopup'>
            <span className='closeBtn' onClick={handleClose}>&times;</span>
            <h4>Student Detail</h4>
            {errorMsg && <p className='error'>{errorMsg}</p>}

            <div className='popupdiv'>
              <label className='popuplabel' htmlFor="name">Name</label><br />
              <input
                className='popupinput'
                value={studentData.name}
                onChange={handleChange}
                type="text"
                name="name"
                id="name"
              />
            </div>

            <div className='popupdiv'>
              <label className='popuplabel' htmlFor="major">Major</label><br />
              <input
                className='popupinput'
                value={studentData.major}
                onChange={handleChange}
                type="text"
                name="major"
                id="major"
              />
            </div>

            <div className='popupdiv'>
              <label className='popuplabel' htmlFor="email">Email</label><br />
              <input
                className='popupinput'
                value={studentData.email}
                onChange={handleChange}
                type="text"
                name="email"
                id="email"
              />
            </div>

            <br />
            <button className='addstudentBtn addeditcolor' onClick={handleSubmit}>
              {studentData.studentid ? "Update Student" : "Add Student"}
            </button>
          </div>
        )}

        {/* Table */}
        <div className='table-box'>
          <table className='table'>
            <thead>
              <tr>
                <th>StudentId</th>
                <th>Name</th>
                <th>Major</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {normalizeStudents(filteredStudents).map(student => (
                <tr key={student.studentid}>
                  <td>{student.studentid}</td>
                  <td>{student.name}</td>
                  <td>{student.major}</td>
                  <td>{student.email}</td>
                  <td>
                    <button className='editBtn addeditcolor' onClick={() => handleUpdate(student)}>Edit</button>
                  </td>
                  <td>
                    <button className='deleteBtn deletecolor' onClick={() => handleDelete(student.studentid)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
