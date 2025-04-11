import { useState } from 'react';

const QuestionDesigner = ({ onAddQuestion }) => {
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['']);
  const [error, setError] = useState('');

  const questionTypes = [
    { id: 'multipleChoice', label: 'Multiple Choice' },
    { id: 'checkboxList', label: 'Checkbox List' },
    { id: 'shortText', label: 'Short Text' },
    { id: 'longText', label: 'Long Text' }
  ];

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div>
        <label className="block mb-1 font-medium">Question Type</label>
        <select 
          className="w-full p-2 border rounded"
          value={questionType} 
          onChange={(e) => setQuestionType(e.target.value)}
        >
          {questionTypes.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Question Text</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question here"
        />
      </div>

      {['multipleChoice', 'checkboxList'].includes(questionType) && (
        <div>
          <label className="block mb-1 font-medium">
            Options
            <button 
              type="button" 
              onClick={addOption}
              className="ml-2 px-2 py-0.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              + Add
            </button>
          </label>
          
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  className="flex-grow p-2 border rounded"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
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
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Question
      </button>
    </form>
  );
};

export default QuestionDesigner;