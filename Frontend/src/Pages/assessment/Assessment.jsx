import React, { useState, useRef } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import {
  FaCircleChevronRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa6";
import "./Assessment.css";
import { BsSkipForwardFill } from "react-icons/bs";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

const questionsData = [
  {
    text: "Do you often find yourself feeling anxious or worried about everyday situations, even when there's no apparent reason?",
    options: [
      "Yes, I frequently experience anxiety in daily situations.",
      "Sometimes, but it depends on the situation.",
      "Rarely, I usually feel calm.",
      "No, I don't experience anxiety often.",
    ],
  },
  {
    text: "How often do you feel down, depressed, or hopeless?",
    options: [
      "Nearly every day.",
      "Several days a week.",
      "Occasionally, but not frequently.",
      "Very rarely or never.",
    ],
  },
  {
    text: "Do you have trouble sleeping, such as falling asleep, staying asleep, or waking up too early?",
    options: [
      "Yes, almost every night.",
      "Sometimes, but it's not consistent.",
      "Rarely, I usually sleep well.",
      "No, I generally have no issues with sleep.",
    ],
  },
  {
    text: "How often do you feel tired or have little energy, even after a full night's sleep?",
    options: [
      "Nearly every day, regardless of how much I sleep.",
      "Sometimes, but it usually passes quickly.",
      "Rarely, I generally feel energized.",
      "Never, I always wake up feeling refreshed.",
    ],
  },
  {
    text: "Do you find it difficult to concentrate on tasks, even those that you used to enjoy?",
    options: [
      "Yes, I frequently lose focus and struggle to concentrate.",
      "Sometimes, but I can usually regain my focus.",
      "Rarely, I can usually concentrate well.",
      "No, I don't have any issues with concentration.",
    ],
  },
  {
    text: "How often do you feel overwhelmed by your responsibilities or tasks?",
    options: [
      "Almost every day, I feel overwhelmed easily.",
      "Sometimes, but I manage to cope.",
      "Rarely, I usually handle my tasks well.",
      "Never, I thrive under pressure.",
    ],
  },
  {
    text: "Do you avoid social situations because you fear being judged or embarrassed?",
    options: [
      "Yes, I often avoid social situations due to fear of judgment.",
      "Sometimes, but I push myself to participate.",
      "Rarely, I usually enjoy socializing.",
      "No, I don't avoid social situations.",
    ],
  },
  {
    text: "How often do you experience irritability or anger over small matters?",
    options: [
      "Frequently, I get irritated or angry easily.",
      "Sometimes, but I can usually control it.",
      "Rarely, I stay calm most of the time.",
      "Never, I don't get irritated over small things.",
    ],
  },
  {
    text: "Do you ever feel disconnected from reality, as if things around you are unreal or dreamlike?",
    options: [
      "Yes, this happens frequently.",
      "Occasionally, but it's not a regular experience.",
      "Rarely, I generally feel grounded in reality.",
      "No, I never feel disconnected from reality.",
    ],
  },
  {
    text: "How often do you feel a lack of interest or pleasure in activities you usually enjoy?",
    options: [
      "Almost every day, I no longer enjoy activities I used to.",
      "Sometimes, but it comes and goes.",
      "Rarely, I still enjoy most activities.",
      "Never, I always find pleasure in my hobbies.",
    ],
  },
  {
    text: "Do you ever feel as though your thoughts are racing, making it difficult to keep up with them?",
    options: [
      "Yes, this happens frequently and it's overwhelming.",
      "Occasionally, but it's manageable.",
      "Rarely, my thoughts are usually calm.",
      "No, I never experience racing thoughts.",
    ],
  },
  {
    text: "How often do you engage in repetitive behaviors or rituals to reduce anxiety?",
    options: [
      "Frequently, I rely on these behaviors often.",
      "Sometimes, but only in certain situations.",
      "Rarely, I don't feel the need for such behaviors.",
      "Never, I don't engage in repetitive behaviors.",
    ],
  },
  {
    text: "Do you find it difficult to trust others, even those close to you?",
    options: [
      "Yes, I often struggle with trust issues.",
      "Sometimes, but it depends on the person.",
      "Rarely, I generally trust those close to me.",
      "No, I have no trouble trusting others.",
    ],
  },
  {
    text: "How often do you feel a sense of guilt or worthlessness?",
    options: [
      "Almost every day, I feel guilty or worthless.",
      "Sometimes, but I try to remind myself of my worth.",
      "Rarely, I generally feel positive about myself.",
      "Never, I don't experience these feelings.",
    ],
  },
  {
    text: "Do you ever feel that people are talking about you or watching you, even when you're alone?",
    options: [
      "Yes, I frequently feel this way.",
      "Occasionally, but I know it's just my imagination.",
      "Rarely, I don't often have these thoughts.",
      "No, I never feel like this.",
    ],
  },
  {
    text: "How often do you feel that you can't control your worrying?",
    options: [
      "Almost every day, my worry feels uncontrollable.",
      "Sometimes, but I can usually manage it.",
      "Rarely, I have control over my worrying.",
      "Never, I don't worry excessively.",
    ],
  },
  {
    text: "Do you experience panic attacks or intense fear that comes on suddenly?",
    options: [
      "Yes, I experience panic attacks frequently.",
      "Sometimes, but they are rare.",
      "Rarely, and they are usually mild.",
      "No, I've never experienced a panic attack.",
    ],
  },
  {
    text: "How often do you feel that your life is not worth living?",
    options: [
      "Frequently, I struggle with these thoughts.",
      "Sometimes, but I try to focus on the positives.",
      "Rarely, I usually feel optimistic about life.",
      "Never, I don't have these thoughts.",
    ],
  },
  {
    text: "Do you find it hard to relax or unwind, even when you have free time?",
    options: [
      "Yes, I find it very difficult to relax.",
      "Sometimes, but I can usually find ways to unwind.",
      "Rarely, I can relax easily when I have free time.",
      "No, I don't have any trouble relaxing.",
    ],
  },
  {
    text: "How often do you have thoughts of harming yourself or others?",
    options: [
      "Frequently, these thoughts are hard to manage.",
      "Sometimes, but I know I won't act on them.",
      "Rarely, and they are fleeting.",
      "Never, I don't have these thoughts.",
    ],
  },
];

const Assessment = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questionsData.length).fill(null)
  );
  const carouselRef = useRef(null);

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
            {questionsData[activeQuestionIndex].text}
          </div>

          <div className="button-group">
            <button onClick={handlePrevious} className="prev-button">
              <FaArrowLeft /> Previous
            </button>
            <button onClick={handleSkip} className="skip-button">
              <BsSkipForwardFill /> Skip
            </button>
            <button onClick={handleNext} className="next-button">
              Next <TbPlayerTrackNextFilled />
            </button>
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
            {questionsData[activeQuestionIndex].options.map(
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
                  {option}
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
