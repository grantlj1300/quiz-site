import React from "react"
import Question from "./Question"
import {nanoid} from "nanoid"

export default function PlayScreen(props) {

    const {playingGame, toStartScreen, toEndGame, gameQuestionsDirty} = props

    const [allQuestions, setAllQuestions] = React.useState([])

    React.useEffect(() => {
        setAllQuestions(gameQuestionsDirty.map((question, index) => {
            let answersArray = question.incorrect_answers.map(answer => (
                {
                    id: nanoid(),
                    text: answer
                }
            ))
            answersArray.push(
                {
                    id: nanoid(),
                    text: question.correct_answer
                }
            )
            let correctId = answersArray[answersArray.length - 1].id
            for (let i = answersArray.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1))
                let temp = answersArray[i]
                answersArray[i] = answersArray[j]
                answersArray[j] = temp
            }
            return  {
                id: index,
                answers: answersArray,
                question: question.question,
                selectedId: undefined,
                correctId: correctId
            }
        }))
    }, [gameQuestionsDirty])

    function handleAnswerClick(event, questionId){
		setAllQuestions(prevQuestions => prevQuestions.map(question => {
            if(question.id === questionId){
                return question.selectedId === event.target.id ?
                    {...question, selectedId: undefined } : 
                    {...question, selectedId: event.target.id }
            }
            else return question
        }))
    }

    function totalCorrect(){
        let correctCount = 0
        allQuestions.forEach(question => {
            correctCount += question.selectedId === question.correctId ? 1 : 0
		})
        return correctCount
    }

    // Generate question elements to display
    if(allQuestions.length){

	const questionElements = allQuestions.map(questionElement => {
		return <Question 
			key={questionElement.id}
			id={questionElement.id}
			questionText={questionElement.question}
			questionAnswers={questionElement.answers}
            selectedId={questionElement.selectedId}
            correctId={questionElement.correctId}
			playingGame={playingGame}
            handleAnswerClick={handleAnswerClick}
		/>
	})

    return (
        <div className="play-screen">
            <div className="question-container">
                {questionElements}
            </div>

            {playingGame && 
            <button className="submit-button" onClick={() => toEndGame(allQuestions)}>
                Check Answers
            </button>}

            {!playingGame && <div className="play-again-container">
                <h2 className="score">
                    You scored {totalCorrect()}/{questionElements.length} correct answers
                </h2>
                <button className="play-again-button" onClick={toStartScreen}>
                    Play Again
                </button>
            </div>}
        </div>
    )
    }
} 