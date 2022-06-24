import React from 'react'
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
		<option key={category.id} value={category.id}>{category.name}</option>
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

	// Stores API return of question objects
	const [gameQuestionsDirty, setGameQuestionsDirty] = React.useState([])

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

	// Grab questions from API and set game state to play
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

	// Set game state to start a new game
	function toStartScreen(){
		setGameQuestionsDirty([])
		setGameState("startGame")
	}

	// Check if all questions have been answered, end game if so
	function toEndGame(questions){
		let allAnswered = true
		questions.forEach(question => {
			let answered = question.selectedId ? true : false
			if (!answered) allAnswered = false
		})
		if (allAnswered) setGameState("endGame")
	}

	return (
		<div className="main-container">
			{gameState === "startGame" && 
			<StartScreen 
				formData={formData}
				handleFormChange={handleFormChange}
				categoryOptions={categoryOptions}
				startGame={startGame}
			/>}

			{(gameState === "playingGame" || gameState === "endGame") && 
			<PlayScreen 
				playingGame={gameState === "playingGame" ? true : false}
				toStartScreen={toStartScreen}
				toEndGame={toEndGame}
				gameQuestionsDirty={gameQuestionsDirty}
			/>}
		</div>
	)
}