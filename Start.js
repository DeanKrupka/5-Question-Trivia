import React from "react"

export default function Start(props) {
    return (
        <div className="start-page-container">
            <h1>General Quiz</h1>
            <h2>Good Luck!</h2>
            <button className="start-btn" onClick={props.handleClick}>Start quiz</button>
        </div>
    )
}