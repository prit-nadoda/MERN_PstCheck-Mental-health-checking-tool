import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoAdd } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaRegLightbulb } from "react-icons/fa";
import { TbExchange } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";
import "./Dashboard.css";
import MyCreditsBar from "../../components/MyCreditsBar";
import MyAreaChart from "../../components/MyAreaChart";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [totalCredits, setTotalCredits] = useState(100);

  const navigate = useNavigate();

  // Fetch reports data from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getAllReports",
          { withCredentials: true }
        );

        if (response.data.success) {
          const reports = response.data.user.reports.map((report) => ({
            title: `Report ${report._id.substring(0, 5)}`,
            score: report.score,
            date: new Date(report.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            id: report._id,
          }));
          setReportData(reports);

          // Set credits used and total credits from the API response
          setCreditsUsed(response.data.user.subscription.credits);
          setTotalCredits(100); // Assuming the limit is 100 based on your component logic
        }
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    };

    fetchReports();
  }, []);

  const goToTest = (e) => {
    e.preventDefault();
    navigate("/assessment");
  };

  const handleReportClick = (index, event) => {
    if (event.shiftKey) {
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
      setSelectedReports((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index]
      );
    } else {
      setSelectedReports([index]);
    }
  };

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
  }, [reportData]);

  const handleDeselectAll = () => {
    setSelectedReports([]);
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
                You are not a subscribed user. Hence, your monthly credit limit
                is 100. You will not be able to generate a new report even after
                deleting the existing ones. To buy more credits, Subscribe to
                the premium PsyCheck pack with unlimited reports per month.
              </p>
            </div>

            <button onClick={goToTest}>
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
                <MyCreditsBar max={totalCredits} current={creditsUsed} />
              </div>
              <button className="buy-cred-btn">Buy Credits</button>
            </div>
            <div className="ov-graph">
              <MyAreaChart
                data={reportData.map((report) => ({
                  date: report.date,
                  score: report.score,
                }))}
              />
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
                key={report.id}
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
