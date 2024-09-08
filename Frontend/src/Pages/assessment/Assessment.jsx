import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRegLightbulb } from "react-icons/fa";
import {
  FaCircleChevronRight,
  FaArrowLeft,
} from "react-icons/fa6";
import { BsSkipForwardFill } from "react-icons/bs";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import "./Assessment.css";

const Assessment = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const carouselRef = useRef(null);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getAllQuestions"
        );
        setQuestionsData(response.data.questions); // Assuming response.data.questions contains the questions array
        setSelectedOptions(Array(response.data.questions.length).fill(null));
      } catch (error) {
        console.error("Failed to load questions!", error); // Log error to console
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
    // Deselect the current question's option
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[activeQuestionIndex] = null;
    setSelectedOptions(updatedSelectedOptions);
    handleNext(); // Move to the next question
  };

  const scrollCarousel = (direction) => {
    const scrollAmount = 350;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  // Handle submit when the user is on the last question
  const handleSubmit = () => {
   
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
  
    // Display filtered selected answers in an alert
    alert(JSON.stringify(filteredAnswers, null, 2));
    console.log(JSON.stringify(filteredAnswers, null, 2));
    
  };
  
  

  if (questionsData.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <section className="asmt-page">
      <div className="main-parent">
        <div className="left">
          <div className="q-count">
            <button
              onClick={() => scrollCarousel("left")}
              className="nav-button"
            >
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
            <button
              onClick={() => scrollCarousel("right")}
              className="nav-button"
            >
              <FaCircleChevronRight />
            </button>
          </div>

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
              <button onClick={handleSubmit} className="next-button">
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
                  {option.text} {/* Adjusted to use option.text */}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assessment;
