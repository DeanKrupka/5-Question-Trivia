import React from "react"
import { decode } from 'html-entities'

// I would probably rename this to QuestionAnswer or something to be more clear what this is
export default function QandA(props) {
  // instead of props you can destructure the props like this
  // const { question, answers, correct, submitted, ident, handleSelection } = props
  
    let classStyle = ''
    
    //render all answers
    const answersJsx = props.answers.map((answer) => {
        if (props.submitted) {
            if (answer === props.correct) {
                classStyle = "correct-answer"
            } else if (answer === props.submitted.answer && !props.submitted.isCorrect) {
                classStyle = "incorrect-answer"
            }  else {
                classStyle = "blank"
            }
        }
        // I would move this down into the render method directly
        return (
            <label key={answer} className={props.submitted ? classStyle : "not-submitted"}>
                    <input 
                        type="radio" 
                        value={answer} 
                        name={props.ident} 
                        className="indiv-answer"
                        onChange={() => props.handleSelection(answer, props.ident)}
                    />
                {decode(answer)}
            </label>
        )
    })

    // Id calculate this stuff up here and then just pass the class down to the jsx
    // 
    // const answerStatus = (answer) => {
    //     if (props.submitted) {
    //         if (answer === props.correct) {
    //             return "correct-answer"
    //         } else if (answer === props.submitted.answer && !props.submitted.isCorrect) {
    //             return "incorrect-answer"
    //         } else {
    //             return "blank"
    //         }
    //     }
    //     return "not-submitted"
    // }


    
    return (
        <div>
          {/* What is this decode thing do ? */}
            <h3 className="indiv-question">{decode(props.question)}</h3>
            <div className="answers-container">
                {answersJsx}
            </div>
        </div>
    )
}