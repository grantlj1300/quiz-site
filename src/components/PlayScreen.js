import React from "react"
import Question from "./Question"

export default function PlayScreen(props) {

    const {playingGame, 
        toStartScreen, toEndGame, gameQuestionsDirty} = props

    const [endGameStats, setEndGameStats] = React.useState(
        {
            totalCorrect: 0,
            totalAnswered: 0
        }
    )

    function updateEndGameStats(prevAnswered, newAnswered, correctId){
        let correct, answered
        if(prevAnswered === newAnswered){
            answered = -1
            correct = correctId === newAnswered ? -1 : 0
        }
        else {
            answered = 1
            correct = correctId === newAnswered ? 1 : 0
        }
        setEndGameStats(prevStats => (
            {
                totalCorrect: prevStats.totalCorrect + correct,
                totalAnswered: prevStats.totalAnswered + answered
            }
        ))
    }

	const questionElements = gameQuestionsDirty.map((questionElement, index) => {
		return <Question 
			key={index}
			id={index}
			questionText={questionElement.question}
			questionAnswers={[...questionElement.incorrect_answers, questionElement.correct_answer]}
			playingGame={playingGame}
            updateEndGameStats={updateEndGameStats}
		/>
	})

    return (
        <div className="play-screen">
            <div className="question-container">
                {questionElements}
            </div>
            {
            playingGame && 
            <button 
                className="submit-button" 
                onClick={toEndGame}
            >Check Answers
            </button>
            }
            {
            !playingGame && 
            <div className="play-again-container">
                <h2 className="score">
                    You scored {endGameStats.totalCorrect}/{questionElements.length} correct answers
                </h2>
                <button 
                    className="play-again-button" 
                    onClick={toStartScreen}
                >Play Again
                </button>
            </div>
            }
        </div>
    )
} 