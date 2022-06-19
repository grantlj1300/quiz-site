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

	// Game state tracks which screen to render
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
			key={nanoid()}
			question={questionElement.question}
			answers={[...questionElement.incorrect_answers, questionElement.correct_answer]}
			correct_answer={questionElement.correct_answer}
		/>
	))

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
			{
			(gameState === "startGame") && 
			<StartScreen 
				formData={formData}
				handleFormChange={handleFormChange}
				categoryOptions={categoryOptions}
				toGamePlayScreen={toGamePlayScreen}
			/>
			}
			{
			(gameState === "playGame") && 
			<PlayScreen 
				questionElements={questionElements}
				toStartScreen={toStartScreen}
			/>
			}
		</div>
	)
}