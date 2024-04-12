// Weird nitpick but I would import {useState, useEffect} from 'react' instead of React for the hooks
import React from "react"
import Start from "./Start"
import QandA from "./QandA"

export default function App() {
    // For these I would be a bit more verbose with the names 
    // I have to read this whole file to figure out what a tok is 
    const [tokData, setTokData] = React.useState(null)
    const [qData, setQData] = React.useState([])
    
    const [randomOrder, setRandomOrder] = React.useState([])


    // I would probably use a map or object here instead of an array of objects
    // You arent going to know how many questions there are if this comes from an api
    // So you would want {0: {answer: '', isCorrect: null}, 1: {answer: '', isCorrect: null}, etc} or whatever you have there
    //  where the key is the index of the question or the id of the question from the API 
    const [selectedAnswers, setSelectedAnswers] = React.useState([{}, {}, {}, {}, {}])

    // I would get a bit more verbose with this name as well submittedAnswers or something hard to tell what this is
    const [submitted, setSubmitted] = React.useState([])

    // I would rename this to like quizState or something to be more clear that this isnt a boolean
    // typically booleans are named like isSomething / hasSomething / showSomething
    const [showQuiz, setShowQuiz] = React.useState('start')
    // I wouldnt use this as a state variable, I would just use a 
    // function to generate the components or just use the components directly
    const [qAndAComponents, setQAndAComponents] = React.useState([])


    // So with all this api stuff you typically would want to abstact out into a client of some sort
    // Especially the token stuff I would pull out but this is definitely a good start 
    // I included an apiClient i've used for like a million projects called apiClient.js
    function fetchQuestions(token) {
        fetch(`https://opentdb.com/api.php?amount=5&type=multiple&token=${token}`)
            .then(response => response.json())
            .then(data => {
                setQData(data.results)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }
    
    React.useEffect(() => {
        fetch('https://opentdb.com/api_token.php?command=request')
            .then(tokResponse => tokResponse.json())
            .then(tokenData => {
                setTokData(tokenData.token)
                fetchQuestions(tokenData.token)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [])
    
    function handleSelection(answer, index) {
        setSelectedAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers]
            updatedAnswers[index] = {
                                        answer: answer,
                                        isCorrect: null
                                    }
            return updatedAnswers
        })
    }
    
    // There a lot of ways to skin this cat and it depends on what you are doing with the data
    // If you already have the data trying to show if they are correct or not you could just do that in the QandA component itself and really restructure this whole thing
    // Like you could just pass the correct answer to the QandA component and then have the component itself determine if the answer is correct or not
    // And have a status on the form that is like 'submitted' or 'not-submitted' and then just change some prop to show the correct answer or not
    function gradeAnswers(event) {  
        event.preventDefault()   
        const updatedAnswers = selectedAnswers.map((answerObj, index) => ({
            ...answerObj, 
            isCorrect: answerObj.answer === qData[index].correct_answer
        }))
        setSelectedAnswers(updatedAnswers)
        setSubmitted(updatedAnswers) 
        setShowQuiz('show-results')
    }
    
    function restartGame(event) {
        event.preventDefault()
        fetchQuestions(tokData)
    }
    
    
    /**
     *  I would remove this and just do in the success of the fetch
     *  Also would pull this out into some kind of helper function so it would just be like  
     * 
     * const randomOrderAnswers = shuffle(data.results); 
     * setQuestionsData(randomOrderAnswers);
     */
     
    React.useEffect(() => {
        if (qData) {
            const randOrder = qData.map((qAObj, index) => {
                //Insert correct answer at random location in 'const answersArr' 
                const answersArr = [...qAObj.incorrect_answers]
                const randomIndex = Math.floor(Math.random()*(answersArr.length + 1)) 
                answersArr.splice(randomIndex, 0, qAObj.correct_answer)
                return answersArr
            })    
        setRandomOrder(randOrder)
        }
    }, [qData])
     
    /** 
     * See my other comments on here about how I would do this 
     */
    React.useEffect(() => {
        if (qData) {
            const qAndAComps = qData.map((qAObj, index) => {
                return (
                            <QandA 
                                key={index}
                                // Theres no reason to pull these all out into individual props
                                // You could just pass the whole object and destructure in the component
                                question={qAObj.question} 
                                correct={qAObj.correct_answer}
                                wrong={qAObj.incorrect_answers}
                                answers={randomOrder[index]}
                                ident={index}
                                handleSelection={handleSelection}
                                submitted={submitted[index]}
                            />       
                        )
            })
            setQAndAComponents(qAndAComps)
        } 
    }, [randomOrder, submitted])
    
    return (
        <div>
            {showQuiz === 'start' && <Start handleClick={() => setShowQuiz('show-quiz')}/>}
            <div className="quiz-container">
                <form className="quiz-form">
                  {/* I would just loop over the questions data here  */}
                  {/* 
                  quizState === 'show-quiz' && questionsData.map((question, index) => {
                    return <QandA key={index} question={question} />
                  }
                  */}
                    {showQuiz === 'show-quiz' || showQuiz === 'show-results' ? qAndAComponents : null}
                    {showQuiz === 'show-quiz' && 
                        <button 
                            className="submit-btn" 
                            onClick={(event) => gradeAnswers(event)}
                        >Submit</button>}
                    {showQuiz === 'show-results' && 
                        <button
                            className="restart-game"
                            >Restart Game</button>}
                </form>
                
            </div>        
        </div>
    )
}  

// compare selectedAnswers with qData.correct_answer
        // if match return true  graded = [t, f, t, t, f]
        // add styles (green) on correct answers
            // add styles (red) to selectedAnswers with f






