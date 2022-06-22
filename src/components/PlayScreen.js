export default function PlayScreen(props) {

    const {playingGame, questionElements, 
        toStartScreen, toEndGame, totalCorrect} = props

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
                    You scored {totalCorrect}/{questionElements.length} correct answers
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