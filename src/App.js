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
	const [gameState, setGameState] = React.useState("startGame")

	function toGamePlayScreen(){
		let url
		let {numQuestions, category, difficulty, type} = formData
		numQuestions = `amount=${numQuestions}`
		category = category === 0 ? "" : `&category=${category}`
		difficulty = difficulty === "" ? "" : `&difficulty=${difficulty}`
		type = type === "" ? "" : `&type=${type}`
		url = `https://opentdb.com/api.php?${numQuestions}
			${category}${difficulty}${type}`
		console.log(url)
		fetch(url)
			.then(res => res.json())
			.then(data => generateNewQuestions(data.results))
		setGameState("playGame")
	}

	function toStartScreen(){
		setGameState("startGame")
	}

	// React.useEffect(() => {

	// 	const url = `https://opentdb.com/api.php?
	// 					amount=${formData.numQuestions}
	// 					${"&category="}`
	// 	fetch("https://opentdb.com/api.php?amount=3")
	// 		.then(res => res.json())
	// 		.then(data => generateNewQuestions(data.results))
	// }, [])

	function generateNewQuestions(questionsArray){
		console.log(questionsArray)
		setAllQuestions(questionsArray)
	}

	const [allQuestions, setAllQuestions] = React.useState([])

	const questionElements = allQuestions.map(questionElement => (
		<Question 
			question={questionElement.question}
			answers={[...questionElement.incorrect_answers, questionElement.correct_answer]}
			correct_answer={questionElement.correct_answer}
		/>
	))

	const [categories, setCategories] = React.useState([])

	React.useEffect(() => {
		fetch("https://opentdb.com/api_category.php")
			.then(res => res.json())
			.then(data => setCategories(data.trivia_categories))
	}, [])

	const categoryOptions = categories.map(category => (
		<option value={category.id}>{category.name}</option>
	))

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
		setFormData(prevFormData => {
			return {
				...prevFormData,
				[name]: value
			}
		})
	}

	return (
		<div className="main-container">
			{(gameState === "startGame") && 
			<div className="start-screen">
				<h1 className="start-title">Quizzical</h1>
				<p className="start-description">Test your knowledge!
				<br />
				Choose your questions below</p>
				<form className="start-form">
					<input 
						className="start-form-input"
						type="number" 
						name="numQuestions"
						value={formData.numQuestions}
						onChange={handleFormChange}
						placeholder="# of Questions (1-50)"
					/>
					<select 
						className="start-form-input"
						name="category"
						value={formData.category}
						onChange={handleFormChange}
					>
						<option value={0}>Any Category</option>
						{categoryOptions}
					</select>
					<select 
						className="start-form-input"
						name="difficulty"
						value={formData.difficulty}
						onChange={handleFormChange}
					>
						<option>Any Difficulty</option>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
					<select 
						className="start-form-input"
						name="type"
						value={formData.type}
						onChange={handleFormChange}
					>
						<option>Any Type</option>
						<option value="multiple">Multiple Choice</option>
						<option value="boolean">True / False</option>
					</select>
				</form>
				<button className="start-button" onClick={toGamePlayScreen}>Start Quiz</button>
			</div>}
			{(gameState === "playGame") && 
			<form className="play-screen">
				{questionElements}
				<button onClick={toStartScreen}>Check Answers</button>
			</form>}
		</div>
	)
}