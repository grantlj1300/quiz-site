import React from 'react'
import {nanoid} from 'nanoid'

export default function Question(props) {

    function answerStyle(answer){
        if(props.gameState === "playingGame"){
            return answer.selected ? " selected" : ""
        }
        else if(props.gameState === "endGame"){
            if(answer.correct){
                return " correct"
            }
            else if(answer.selected){
                return " incorrect"
            }
            else {
                return " blank"
            }
        }
    }

    const answerElements = props.answers.map(answer => (
        <button className={`question-answer${answerStyle(answer)}`}
                key={answer.id}
                id={answer.id}
                onClick={props.gameState === "playingGame" ? 
                (event) => props.handleAnswerClick(event, props.id) : undefined}
                dangerouslySetInnerHTML={{__html: answer.text}}
        >
        </button>
    ))

    return (
        <div className="question">
            <h2 className="question-header"
                dangerouslySetInnerHTML={{__html: props.question}}
            >
            </h2>
            <div className="question-choices">
                {answerElements}
            </div>
        </div>
    )
} 