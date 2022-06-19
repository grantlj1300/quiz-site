export default function Question(props) {

    const answerArray = props.answers.map(answer => (
        <button>{answer}</button>
    ))

    return (
        <div className="question">
            <label>{props.question}</label>
            <div className="question-choices">
                {answerArray}
            </div>
        </div>
    )
} 