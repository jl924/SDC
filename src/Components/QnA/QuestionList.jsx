import React, { useState, useEffect, useContext } from "react";
import AnswerList from "./AnswerList.jsx";
import axios from "axios";
import Amodal from "./AnswerModal.jsx";
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
//import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
//import { MdOutlineExpandCircleDown } from "react-icons/md";
import "./QnA.css";
import Button from "@mui/material/Button";
import ElementContext from "../../ElementContext.js";
import ClickTracker from "../../ClickTracker.jsx";

const QuestionList = ({ product, question, key }) => {
  const element = useContext(ElementContext);
  const [answers, setAnswers] = useState(question.answers);
  const [result, setResult] = useState(2);
  const [modal, setModal] = useState(false);
  const id = question.question_id;
  //formats our answers to make it able to slice
  function format(answers) {
    let answerArray = [];
    for (var key in answers) {
      answerArray.push(answers[key]);
    }
    return answerArray;
  }
  let array = format(answers);
  //set seller to #1 result

  let sortedArray = array.sort((a, b) =>
    a.helpfulness < b.helpfulness ? 1 : -1
  );

  function concattedArray() {
    let sortArray = sortedArray;
    let concatArray = [];
    sortArray.forEach((element, index) => {
      if (element.answerer_name.toLowerCase() === "seller") {
        concatArray = sortArray.splice(index, 1);
      }
    });
    return concatArray.concat(sortArray);
  }

  const newArray = concattedArray();

  //slices the data to show more answers on request
  function clickHandler(amount) {
    setResult((currentResult) => {
      return currentResult + amount;
    });
  }
  // vote handler for question helpfulness
  function voteHandler(event) {
    event.currentTarget.classList.toggle("voted");
    axios
      .put(`/qa/questions/${question.question_id}/helpful`, {
        params: {
          question_id: question.question_id,
        },
      })
      .then((res) => {
        // console.log("response to put for questions", res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //reports questions for violations
  function reportHandler(event) {
    event.target.innerText = "REPORTED";
    axios
      .put(`/qa/questions/${question.question_id}/report`, {
        params: {
          question_id: question.question_id,
        },
      })
      .then((res) => {
        // console.log("response to put for questions", res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //keeps the questions list updated
  useEffect(() => {
    setAnswers(question.answers);
  }, [question]);

  return (
    <>
      <div className="qQuestionCard">
        <div>
          <ElementContext.Provider value={`${element}-Questioncard-${id}`}>
            <ClickTracker
              selector={`${element}-QuestionTitle-questionId:${id}`}
              WrappedComponent={
                <div>
                  <b>Q: {question.question_body}</b>
                </div>
              }
            />
          </ElementContext.Provider>
          {newArray.slice(0, result).map((answer, i) => (
            <ClickTracker
              selector={`${element}-AnswerCard-questionId:${id}`}
              WrappedComponent={<AnswerList answer={answer} key={i} />}
            />
          ))}
          {result < array.length && (
            <ClickTracker
              selector={`${element}-Load_More_Question_Button-${id}`}
              WrappedComponent={
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => clickHandler(array.length)}
                  sx={{
                    fontFamily:
                      'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
                    fontWeight: '10px',
                    fontSize: 15,
                    color: '#3f51b5',
                    margin: '5px',
                    padding: '10px',
                    borderColor: '#3f51b5',
                  }}
                >
                  Load More Answers
                </Button>
              }
            />
          )}
          {array.length > 2 && result > array.length && (
            <ClickTracker
              selector={`${element}-Collapse_Button-${id}`}
              WrappedComponent={
                <Button
                size="small"
                variant="outlined"
                  sx={{
                    fontFamily:
                      'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
                    fontWeight: '10px',
                    fontSize: 15,
                    color: '#3f51b5',
                    margin: '5px',
                    padding: '10px',
                    borderColor: '#3f51b5',
                  }}
                  onClick={() => setResult(2)}
                >
                  Collapse Answers
                </Button>
              }
            />
          )}
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}} >
          <ClickTracker
            selector={`${element}-Vote_Q_Button-${id}`}
            WrappedComponent={
              <Button  sx={{
                fontFamily:
                  'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
                fontWeight: 15,
                fontSize: 12,
                color: 'grey',
                margin: '1px',
                padding: '5px',
              }} className="vote" onClick={voteHandler}>
                Helpful?[
                {question.question_helpfulness}]{" "}
              </Button>
            }
          />
          <ClickTracker
            selector={`${element}-Add_Answer_Button-${id}`}
            WrappedComponent={
              <Button  sx={{
                fontFamily:
                  'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
                fontWeight: 15,
                fontSize: 12,
                color: 'grey',
                margin: '1px',
                padding: '5px',
              }}  size="small" onClick={() => setModal(true)}>
                Add Answer
              </Button>
            }
          />
          <ClickTracker
            selector={`${element}-Report_Q_Button-${id}`}
            WrappedComponent={
              <Button
              sx={{
                fontFamily:
                  'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
                fontWeight: 15,
                fontSize: 12,
                color: 'grey',
                margin: '1px',
                padding: '5px',
              }}
                size="small"
                onClick={reportHandler}
                style={{ cursor: "pointer" }}
              >
                Report
              </Button>
            }
          />
        </div>

        <Amodal
          open={modal}
          onClose={setModal}
          question={question}
          product={product}
        />
      </div>
    </>
  );
};

export default QuestionList;
