import React from "react"
import { decode } from 'html-entities'

export default function QandA(props) {
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
    
    return (
        <div>
            <h3 className="indiv-question">{decode(props.question)}</h3>
            <div className="answers-container">
                {answersJsx}
            </div>
        </div>
    )
}