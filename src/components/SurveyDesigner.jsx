import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QuestionDesigner from './QuestionDesigner';
import QuestionPreview from './QuestionPreview';

const SurveyDesigner = () => {
  const [questions, setQuestions] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('');

  const addQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: uuidv4()
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Survey Designer</h1>
      
      <div className="mb-6">
        <label className="block mb-1 text-lg font-medium">Survey Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded text-lg"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
          placeholder="Enter survey title"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add Questions</h2>
          <QuestionDesigner onAddQuestion={addQuestion} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Survey Preview
            {questions.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
            )}
          </h2>
          {surveyTitle && (
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">{surveyTitle}</h3>
          )}
          <QuestionPreview 
            questions={questions} 
            onRemoveQuestion={removeQuestion} 
          />
        </div>
      </div>
    </div>
  );
};

export default SurveyDesigner;