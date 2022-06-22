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

	function startGame(){
		fetch(generateUrl())
			.then(res => res.json())
			.then(data => generateNewQuestions(data.results))

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
		setAllQuestions([])
		setGameState("startGame")
	}

	const [totalCorrect, setTotalCorrect] = React.useState(0)

	function toEndGame(){
		let correctAnswers = 0, answered = 0
		for (let i = 0; i < allQuestions.length; i++) {
			let questionAnswered = false
			for(let j = 0; j < allQuestions[i].answers.length; j++){
				if(allQuestions[i].answers[j].correct && allQuestions[i].answers[j].selected){
					correctAnswers++
					questionAnswered = true
				}
				else if(allQuestions[i].answers[j].selected){
					questionAnswered = true
				}
			}
			if(questionAnswered){
				answered++
			}
			else{ return}
		}
		setTotalCorrect(correctAnswers)
		setGameState("endGame")
	}

	function generateNewQuestions(questionsArray){
		let questions = []
		for (let i = 0; i < questionsArray.length; i++) {
			let answersArray = questionsArray[i].incorrect_answers.map(answer => (
				{
					id: nanoid(),
					text: answer,
					selected: false,
					correct: false
				}
			))
			answersArray.push(
				{
					id: nanoid(),
					text: questionsArray[i].correct_answer,
					selected: false,
					correct: true
				}
			) 
			for (let i = answersArray.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				let temp = answersArray[i];
				answersArray[i] = answersArray[j];
				answersArray[j] = temp;
			}
			questions[i] = 
			{
				id: i,
				answers: answersArray,
				question: questionsArray[i].question
			}
		}
		setAllQuestions(questions)
	}

	const [allQuestions, setAllQuestions] = React.useState([])

	const questionElements = allQuestions.map(questionElement => {
		return <Question 
			key={questionElement.id}
			id={questionElement.id}
			question={questionElement.question}
			handleAnswerClick={handleAnswerClick}
			answers={questionElement.answers}
			gameState={gameState}
		/>
	})

	function handleAnswerClick(event, questionIndex){
		setAllQuestions(prevQuestions => prevQuestions.map(question => {
			if (question.id === questionIndex) {
				let updatedAnswers = question.answers.map(answer => (
					event.target.id === answer.id ? 
                	{...answer, selected: !answer.selected} : {...answer, selected: false}
				))
				return {...question, answers: updatedAnswers}
			}
			else {
				return {...question}
			}
		}
		))
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
				questionElements={questionElements}
				toStartScreen={toStartScreen}
				toEndGame={toEndGame}
				totalCorrect={totalCorrect}
			/>
			}
		</div>
	)
}