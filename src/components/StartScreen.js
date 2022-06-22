export default function StartScreen(props) {

    const {formData, handleFormChange, categoryOptions, startGame} = props
    const validNum = (formData.numQuestions > 0) && (formData.numQuestions < 51) ?
            true : false

    return (
        <div className="start-screen">
            <h1 className="start-title">Quizzical</h1>
            <p className="start-description">Test your knowledge!
            <br />
            Choose your questions below</p>
            <div className="start-form">
                <input 
                    className={`start-form-input number${validNum ? "" : " bad-num"}`}
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
            </div>
            <button 
                className="start-button" 
                onClick={validNum ? startGame : undefined}>
                    Start Quiz</button>
        </div>
    )
} 