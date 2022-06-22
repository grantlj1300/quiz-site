import React from 'react'
import {nanoid} from 'nanoid'

export default function Question(props) {

    const {id, questionText, questionAnswers, playingGame, updateEndGameStats} = props

    const [questionBlock, setQuestionBlock] = React.useState(generateNewQuestion())

    function generateNewQuestion(){
        let answersArray = questionAnswers.map(answer => (
            {
                id: nanoid(),
                text: answer,
                selected: false,
                correct: false
            }
        ))
        answersArray[answersArray.length - 1].correct = true
        let correctAnswerId = answersArray[answersArray.length - 1].id
        for (let i = answersArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = answersArray[i];
            answersArray[i] = answersArray[j];
            answersArray[j] = temp;
        }
        return  {
                    id: id,
                    answers: answersArray,
                    question: questionText,
                    answeredId: undefined,
                    correctId: correctAnswerId
                }
        }

    function answerStyle(answer){
        if(playingGame){
            return answer.selected ? " selected" : ""
        }
        else{
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

    function handleAnswerClick(event){
		setQuestionBlock(prevBlock => {
            let newAnsweredId
            let updatedAnswers = prevBlock.answers.map(answer => {
                if(event.target.id === answer.id){
                    newAnsweredId = answer.selected ? undefined : answer.id
                    return {...answer, selected: !answer.selected}
                }
                else {
                    return {...answer, selected: false}
                }
            })
            updateEndGameStats(prevBlock.answeredId, newAnsweredId, prevBlock.correctId)
            return {...prevBlock, answers: updatedAnswers, answeredId: newAnsweredId}
		})
    }

    const answerElements = questionBlock.answers.map(answer => (
        <button className={`question-answer${answerStyle(answer)}`}
                key={answer.id}
                id={answer.id}
                onClick={playingGame ? 
                (event) => handleAnswerClick(event) : undefined}
                dangerouslySetInnerHTML={{__html: answer.text}}
        >
        </button>
    ))

    return (
        <div className="question">
            <h2 className="question-header"
                dangerouslySetInnerHTML={{__html: questionBlock.question}}
            >
            </h2>
            <div className="question-choices">
                {answerElements}
            </div>
        </div>
    )
} 