import React from 'react';

const QuestionPreview = ({ questions = [], onRemoveQuestion }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No questions added yet. Use the form on the left to add questions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="border p-4 rounded bg-gray-50 relative">
          <button 
            onClick={() => onRemoveQuestion(question.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            aria-label="Remove question"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              {index + 1}. {getQuestionTypeLabel(question.type)}
            </span>
          </div>
          
          <h3 className="text-lg font-medium mb-2">{question.text}</h3>
          
          {renderQuestionPreview(question)}
        </div>
      ))}
    </div>
  );
};

// Helper function to get user-friendly question type labels
const getQuestionTypeLabel = (type) => {
  const types = {
    multipleChoice: 'Multiple Choice',
    checkboxList: 'Checkbox List',
    shortText: 'Short Text',
    longText: 'Long Text'
  };
  return types[type] || type;
};

// Render appropriate input based on question type
const renderQuestionPreview = (question) => {
  switch (question.type) {
    case 'multipleChoice':
      return (
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <input 
                type="radio" 
                name={`question-${question.id}`} 
                disabled 
                className="mr-2" 
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    
    case 'checkboxList':
      return (
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <input 
                type="checkbox" 
                disabled 
                className="mr-2" 
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    
    case 'shortText':
      return (
        <input 
          type="text" 
          disabled 
          placeholder="Short answer text" 
          className="w-full p-2 border rounded bg-gray-100" 
        />
      );
    
    case 'longText':
      return (
        <textarea 
          disabled 
          placeholder="Long answer text" 
          className="w-full p-2 border rounded bg-gray-100 h-24" 
        />
      );
    
    default:
      return null;
  }
};

export default QuestionPreview;