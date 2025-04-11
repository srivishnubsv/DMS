import { useState } from 'react';

const QuestionDesigner = ({ onAddQuestion }) => {
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['']);
  const [error, setError] = useState('');

  const questionTypes = [
    { id: 'multipleChoice', label: 'Multiple Choice', icon: '⚪' },
    { id: 'checkboxList', label: 'Checkbox List', icon: '☑' },
    { id: 'shortText', label: 'Short Text', icon: '✎' },
    { id: 'longText', label: 'Long Text', icon: '✏️' }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'multipleChoice': return 'border-blue-200 bg-blue-50';
      case 'checkboxList': return 'border-purple-200 bg-purple-50';
      case 'shortText': return 'border-green-200 bg-green-50';
      case 'longText': return 'border-amber-200 bg-amber-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }

    if (['multipleChoice', 'checkboxList'].includes(questionType)) {
      // Filter out empty options
      const validOptions = options.filter(opt => opt.trim() !== '');
      
      if (validOptions.length < 2) {
        setError('At least two options are required');
        return;
      }

      onAddQuestion({
        type: questionType,
        text: questionText,
        options: validOptions
      });
    } else {
      onAddQuestion({
        type: questionType,
        text: questionText
      });
    }

    // Reset form
    setQuestionText('');
    setOptions(['']);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium text-gray-700">Question Type</label>
          <div className="grid grid-cols-2 gap-2">
            {questionTypes.map(type => (
              <button
                key={type.id}
                type="button"
                className={`
                  flex items-center p-3 border rounded-lg transition-all
                  ${questionType === type.id 
                    ? `${getTypeColor(type.id)} ring-2 ring-blue-500 ring-opacity-50` 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                `}
                onClick={() => setQuestionType(type.id)}
              >
                <span className="text-xl mr-2">{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`p-4 border rounded-lg ${getTypeColor(questionType)}`}>
          <label className="block mb-2 font-medium text-gray-700">Question Text</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here"
          />
        </div>

        {['multipleChoice', 'checkboxList'].includes(questionType) && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <label className="font-medium text-gray-700">Options</label>
              <button 
                type="button" 
                onClick={addOption}
                className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Option
              </button>
            </div>
            
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-2 text-gray-400 flex-shrink-0">
                    {questionType === 'multipleChoice' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect width="16" height="16" x="4" y="4" strokeWidth="2" rx="2" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove option"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Question
        </button>
      </form>
    </div>
  );
};

export default QuestionDesigner;