import React from 'react'
import Question from './components/Question'

export default function App() {
/*
API: https://opentdb.com/api.php?
	amount=10 (or 1-50)
	&category=9 (9-32 or not included)
	&difficulty=easy (or medium/hard or not included)
	&type=multiple (or boolean for true/false or not specified)
*/
	const [newGame, setNewGame] = React.useState(true)

	function toggleNewGame(){
		setNewGame(prevState => !prevState)
	}

	React.useEffect(() => {
		fetch("https://opentdb.com/api.php?amount=1")
			.then(res => res.json())
			.then(data => console.log(data.results[0]))
	}, [])

	function generateNewQuestions(){
		const questionsArray = []

		for(let i = 0; i < 5; i++){
			questionsArray.push(<Question />)
		}

		return questionsArray
	}

	const [allQuestions, setAllQuestions] = React.useState(generateNewQuestions())


	return (
		<div className="main-container">
			{newGame && <div className="start-screen">
				<h1>Quizzical</h1>
				<form>
					<input type="text" name="numQuestions"/>
					<select>
						<option value="9">General Knowledge</option>
					</select>
					<select>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
					<select>
						<option value="multiple">Multiple Choice</option>
						<option value="boolean">True / False</option>
					</select>
				</form>
				<p className="start-description">Random description text blah blah blah</p>
				<button className="start-button" onClick={toggleNewGame}>Start Quiz</button>
			</div>}
			{!newGame && <form className="play-screen">
				{allQuestions}
				<button onClick={toggleNewGame}>Check Answers</button>
			</form>}
		</div>
	)
}