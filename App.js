import React from "react"
import Start from "./Start"
import QandA from "./QandA"

export default function App() {
    const [tokData, setTokData] = React.useState(null)
    const [qData, setQData] = React.useState([])
    const [randomOrder, setRandomOrder] = React.useState([])
    const [selectedAnswers, setSelectedAnswers] = React.useState([{}, {}, {}, {}, {}])
    const [submitted, setSubmitted] = React.useState([])
    const [showQuiz, setShowQuiz] = React.useState('start')
    const [qAndAComponents, setQAndAComponents] = React.useState([])

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
     
    React.useEffect(() => {
        if (qData) {
            const qAndAComps = qData.map((qAObj, index) => {
                return (
                            <QandA 
                                key={index}
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






