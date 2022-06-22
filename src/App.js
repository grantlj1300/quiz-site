import React from 'react'
import {nanoid} from 'nanoid'
import Question from './components/Question'
import StartScreen from './components/StartScreen'
import PlayScreen from './components/PlayScreen'

export default function App() {

	// Grab category: id data from API once
	const [categories, setCategories] = React.useState([])
	React.useEffect(() => {
		fetch("https://opentdb.com/api_category.php")
			.then(res => res.json())
			.then(data => setCategories(data.trivia_categories))
	}, [])

	const categoryOptions = categories.map(category => (
		<option 
			key={category.id}
			value={category.id}
		>{category.name}</option>
	))

	// Generate form to hold user input
	const [formData, setFormData] = React.useState(
		{
			numQuestions: "",
			category: 0,
			difficulty: "",
			type: ""
		}
	)

	function handleFormChange(event) {
		const {name, value} = event.target
		setFormData(prevFormData => (
			{
				...prevFormData,
				[name]: value
			}
		))
	}

	// Game state tracks which screen to render
	const [gameState, setGameState] = React.useState("startGame")

	function generateUrl() {
		let {numQuestions, category, difficulty, type} = formData

		numQuestions = `amount=${numQuestions}`
		category = category === 0 ? "" : `&category=${category}`
		difficulty = difficulty === "" ? "" : `&difficulty=${difficulty}`
		type = type === "" ? "" : `&type=${type}`

		return `https://opentdb.com/api.php?${numQuestions}
			${category}${difficulty}${type}`
	}

	const [gameQuestionsDirty, setGameQuestionsDirty] = React.useState([])

	function startGame(){
		fetch(generateUrl())
			.then(res => res.json())
			.then(data => setGameQuestionsDirty(data.results))

		setGameState("playingGame")

		setFormData(
			{
				numQuestions: "",
				category: 0,
				difficulty: "",
				type: ""
			}
		)
	}

	function toStartScreen(){
		setGameQuestionsDirty([])
		setGameState("startGame")
	}

	function toEndGame(){
		// let correctAnswers = 0, answered = 0
		// for (let i = 0; i < allQuestions.length; i++) {
		// 	let questionAnswered = false
		// 	for(let j = 0; j < allQuestions[i].answers.length; j++){
		// 		if(allQuestions[i].answers[j].correct && allQuestions[i].answers[j].selected){
		// 			correctAnswers++
		// 			questionAnswered = true
		// 		}
		// 		else if(allQuestions[i].answers[j].selected){
		// 			questionAnswered = true
		// 		}
		// 	}
		// 	if(questionAnswered){
		// 		answered++
		// 	}
		// 	else{ return}
		// }
		// setTotalCorrect(correctAnswers)
		setGameState("endGame")
	}

	return (
		<div className="main-container">
			{
			gameState === "startGame" && 
			<StartScreen 
				formData={formData}
				handleFormChange={handleFormChange}
				categoryOptions={categoryOptions}
				startGame={startGame}
			/>
			}
			{
			(gameState === "playingGame" || gameState === "endGame")&& 
			<PlayScreen 
				playingGame={gameState === "playingGame" ? true : false}
				toStartScreen={toStartScreen}
				toEndGame={toEndGame}
				gameQuestionsDirty={gameQuestionsDirty}
			/>
			}
		</div>
	)
}