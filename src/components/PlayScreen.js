export default function PlayScreen(props) {

    const {questionElements, toStartScreen} = props

    return (
        <form className="play-screen">
            <div className="question-container">
                {questionElements}
            </div>
            <button className="submit-button" onClick={toStartScreen}>Check Answers</button>
        </form>
    )
} 