export default function Question(props) {

    const answerArray = props.answers.map(answer => (
        <button className="question-answer"
                dangerouslySetInnerHTML={{__html: answer}}
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
                {answerArray}
            </div>
        </div>
    )
} 