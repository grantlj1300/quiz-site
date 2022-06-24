import React from 'react'

export default function Question(props) {

    const { id, 
            questionText, 
            questionAnswers, 
            selectedId,
            correctId,
            playingGame, 
            handleAnswerClick } = props

    function answerStyle(answer){
        if (playingGame) return answer.id === selectedId ? " selected" : ""
        else {
            if (answer.id === correctId) return " correct"
            else if (answer.id === selectedId) return " incorrect"
            else return " blank"
        }
    }
    
    const answerElements = questionAnswers.map(answer => (
        <button className={`question-answer${answerStyle(answer)}`}
                key={answer.id}
                id={answer.id}
                onClick={playingGame ? 
                (event) => handleAnswerClick(event, id) : undefined}
                dangerouslySetInnerHTML={{__html: answer.text}}
        >
        </button>
    ))

    return (
        <div className="question">
            <h2 className="question-header"
                dangerouslySetInnerHTML={{__html: questionText}}
            >
            </h2>
            <div className="question-choices">
                {answerElements}
            </div>
        </div>
    )
} 