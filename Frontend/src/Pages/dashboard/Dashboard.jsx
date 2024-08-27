import React, { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaRegLightbulb } from "react-icons/fa";
import { TbExchange } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";
import "./Dashboard.css";
import MyCreditsBar from "../../components/MyCreditsBar";
import MyAreaChart from "../../components/MyAreaChart";

const reportData = [
  { title: "Report 1", score: 85, date: "10 Aug, 2024" },
  { title: "Report 2", score: 92, date: "15 Aug, 2024" },
  { title: "Report 3", score: 20, date: "20 Aug, 2024" },
  { title: "Report 4", score: 55, date: "25 Aug, 2024" },
  { title: "Report 5", score: 90, date: "30 Aug, 2024" },
];

const formatDataForChart = (reports) => {
  return reports.map((report) => ({
    date: report.date,
    score: report.score,
  }));
};

const Dashboard = () => {
  const [selectedReports, setSelectedReports] = useState([]);

  // Handle clicking on a report
  const handleReportClick = (index, event) => {
    if (event.shiftKey) {
      // Shift + click for multiple selection
      let lastSelectedIndex = selectedReports[selectedReports.length - 1];
      let newSelection = [...selectedReports];
      const range = [
        Math.min(lastSelectedIndex, index),
        Math.max(lastSelectedIndex, index),
      ];
      for (let i = range[0]; i <= range[1]; i++) {
        if (!newSelection.includes(i)) {
          newSelection.push(i);
        }
      }
      setSelectedReports(newSelection);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl + click to toggle selection
      setSelectedReports((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index]
      );
    } else {
      // Single click to select one
      setSelectedReports([index]);
    }
  };

  // Handle Ctrl+A to select all reports
  useEffect(() => {
    const handleCtrlA = (event) => {
      if (event.ctrlKey && event.key === "a") {
        event.preventDefault();
        setSelectedReports(reportData.map((_, index) => index));
      }
    };
    document.addEventListener("keydown", handleCtrlA);
    return () => {
      document.removeEventListener("keydown", handleCtrlA);
    };
  }, []);

  // Handle deselecting all selected reports
  const handleDeselectAll = () => {
    setSelectedReports([]); // Clear the selected reports array
  };

  return (
    <>
      <section className="dashboard">
        <div className="top">
          <div className="left">
            <h3 className="heading">Dashboard</h3>
            <p>Create and start your mental health journey</p>
            <div className="note-container">
              <h4 className="title">
                <FaRegLightbulb /> Note:
              </h4>
              <p className="note-text">
                You are not subscribed user. Hence, your monthly credit limit is
                100. You will not be able to generate a new report even after
                deleting the existing ones. To buy more credits, Subscribe to
                the premium PsyCheck pack with unlimited reports per months.
              </p>
            </div>
            <button>
              <IoAdd /> Add New
            </button>
          </div>
          <div className="right">
            <div className="r-1">
              <div>
                <h4 className="rpt-title">Total Reports</h4>
                <h5>{reportData.length}</h5>
              </div>
              <div>
                <h4>Monthly credits Used</h4>
                <MyCreditsBar max={100} current={45} />
              </div>
              <button className="buy-cred-btn">Buy Credits</button>
            </div>
            <div className="ov-graph">
              <MyAreaChart data={formatDataForChart(reportData)} />
            </div>
          </div>
        </div>

        <div className="bottom">
          <h3>Previously generated reports</h3>
          {selectedReports.length > 0 && (
            <div className="selection-bar">
              <span onClick={handleDeselectAll} style={{ cursor: "pointer" }}>
                <IoMdClose /> {selectedReports.length} Selected
              </span>
              <div className="selection-btn-container">
                <TbExchange /> Compare
                <AiFillDelete /> Delete
              </div>
            </div>
          )}
          <div className="reports-container">
            {reportData.map((report, index) => (
              <div
                className={`report ${
                  selectedReports.includes(index) ? "active" : ""
                }`}
                key={index}
                onClick={(event) => handleReportClick(index, event)}
              >
                <h4>{report.title}</h4>
                <h5>Health score - {report.score}</h5>
                <p>Created at {report.date}</p>
                <div className="button-container">
                  <button className="del-btn">Delete Report</button>
                  <button className="view-btn">View Report</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
