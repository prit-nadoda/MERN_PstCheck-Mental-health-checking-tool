import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRegLightbulb } from "react-icons/fa";
import { FaCircleChevronRight, FaArrowLeft } from "react-icons/fa6";
import { BsSkipForwardFill } from "react-icons/bs";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import DialogBox from "../../components/DialogBox/DialogBox"; // Import the modal component
import "./Assessment.css";
import { Toast } from "bootstrap";

const Assessment = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const carouselRef = useRef(null);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getAllQuestions"
        );
        setQuestionsData(response.data.questions);
        setSelectedOptions(Array(response.data.questions.length).fill(null));
      } catch (error) {
        console.error("Failed to load questions!", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionClick = (index) => {
    setActiveQuestionIndex(index);
  };

  const handleOptionClick = (optionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[activeQuestionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleNext = () => {
    if (activeQuestionIndex < questionsData.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[activeQuestionIndex] = null;
    setSelectedOptions(updatedSelectedOptions);
    handleNext();
  };

  const scrollCarousel = (direction) => {
    const scrollAmount = 350;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalSubmit = () => {
    closeModal();
    handleSubmit(); // Call handleSubmit when confirmed
  };

  const handleSubmit = async () => {
    const selectedAnswers = selectedOptions.map(
      (optionIndex, questionIndex) => {
        return optionIndex !== null
          ? questionsData[questionIndex]?.options[optionIndex]?.text
          : null;
      }
    );

    const filteredAnswers = selectedAnswers.filter(
      (answer) => answer !== null && answer !== "None of these signs"
    );

    
    console.log(JSON.stringify(filteredAnswers, null, 2));

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/submit-assessment",
        filteredAnswers, { withCredentials: true }
      );
      
      // Check response
      if (response.data.success) {
        console.log(JSON.stringify(response.data.report, null, 2));
        const report = response.data.report;
        alert(`Report Generated!\n\nScore: ${report.score}\n\n...`);
      } else {
        alert(response.data.message || "Failed to generate the report");
      }
    } catch (error) {
      console.error("Error submitting assessment", error);
      alert(error.response?.data?.message || "Failed to submit assessment. Please try again.");
    }
  };

  if (questionsData.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <section className="asmt-page">
      <div className="main-parent">
        <div className="left">
          {/* Question Navigation */}
          <div className="q-count">
            <button onClick={() => scrollCarousel("left")} className="nav-button">
              <FaCircleChevronRight style={{ transform: "rotate(180deg)" }} />
            </button>
            <div className="questions-wrapper">
              <div className="questions-container" ref={carouselRef}>
                {questionsData.map((_, index) => (
                  <span
                    key={index}
                    className={index === activeQuestionIndex ? "active" : ""}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {`Question #${index + 1}`}
                  </span>
                ))}
              </div>
              <div className="fade fade-left"></div>
              <div className="fade fade-right"></div>
            </div>
            <button onClick={() => scrollCarousel("right")} className="nav-button">
              <FaCircleChevronRight />
            </button>
          </div>

          {/* Current Question */}
          <div className="question">
            {questionsData[activeQuestionIndex]?.text}
          </div>

          <div className="button-group">
            <button onClick={handlePrevious} className="prev-button">
              <FaArrowLeft /> Previous
            </button>
            <button onClick={handleSkip} className="skip-button">
              <BsSkipForwardFill /> Skip
            </button>

            {/* Conditionally render "Next" or "Submit" button */}
            {activeQuestionIndex === questionsData.length - 1 ? (
              <button onClick={openModal} className="next-button">
                Submit
              </button>
            ) : (
              <button onClick={handleNext} className="next-button">
                Next <TbPlayerTrackNextFilled />
              </button>
            )}
          </div>

          <div className="note-container">
            <h4 className="title">
              <FaRegLightbulb /> Note :
            </h4>
            <p className="note-text">
              Choose an option to answer the question then press the next button
              to move further. Make sure that the option you choose is relevant
              to your mental state to maintain accuracy of your report. You can
              also skip a question without choosing an option or by choosing
              none of above.
            </p>
          </div>
        </div>

        <div className="right">
          <h4 className="title">
            Choose a relevant option or skip the question
          </h4>
          <div className="options">
            {questionsData[activeQuestionIndex]?.options.map(
              (option, optionIndex) => (
                <p
                  key={optionIndex}
                  className={`option ${
                    selectedOptions[activeQuestionIndex] === optionIndex
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleOptionClick(optionIndex)}
                >
                  {option.text}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {showModal && (
        <DialogBox
          show={showModal} // Pass showModal state
          dialogText="Are you sure you want to submit the assessment?"
          confirmText="Submit"
          cancelText="Cancel"
          onConfirm={handleModalSubmit}
          onClose={closeModal} // Make sure onClose is passed correctly
        />
      )}
    </section>
  );
};

export default Assessment;
