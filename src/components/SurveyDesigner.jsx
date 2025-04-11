import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QuestionDesigner from './QuestionDesigner';
import SurveyPreview from './SurveyPreview';

const SurveyDesigner = () => {
  const [questions, setQuestions] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('');
  const previewContainerRef = useRef(null);
  const shouldScrollToBottomRef = useRef(false);

  const addQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: uuidv4()
    };
    setQuestions([...questions, newQuestion]);
    shouldScrollToBottomRef.current = true;
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleReorderQuestions = (updateFnOrValue) => {
    if (typeof updateFnOrValue === 'function') {
      setQuestions(updateFnOrValue);
    } else {
      setQuestions(updateFnOrValue);
    }
  };

  // Scroll to bottom of preview when a new question is added
  useEffect(() => {
    if (shouldScrollToBottomRef.current && previewContainerRef.current) {
      setTimeout(() => {
        const container = previewContainerRef.current;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
        shouldScrollToBottomRef.current = false;
      }, 100); // Small timeout to ensure DOM is updated
    }
  }, [questions]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {/* Left column - Question Designer (1/3 width) */}
        <div className="w-1/3 bg-white shadow-lg p-6 overflow-y-auto border-r border-gray-200">
          <div className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Design Your Questions
            </h2>
            <p className="text-sm text-gray-500 mt-1">Add and configure questions for your survey</p>
          </div>
          <div className="pb-12">
            <QuestionDesigner onAddQuestion={addQuestion} />
          </div>
        </div>
        
        {/* Right column - Question Preview (2/3 width) */}
        <div className="w-2/3 bg-gray-50">
          <div className="p-6 sticky top-0 bg-white z-10 border-b border-gray-200 shadow-sm">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-blue-600">Survey Preview</span>
              </div>
              <input
                type="text"
                className="w-full p-2 text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="Enter survey title..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600 text-sm">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
                {questions.length > 0 && (
                  <span className="text-sm text-gray-500">Drag questions to reorder</span>
                )}
              </div>
            </div>
          </div>
          
          <div 
            ref={previewContainerRef}
            className="overflow-y-auto px-6 py-8 pb-24" 
            style={{ height: 'calc(100vh - 104px)' }} 
          >
            <div className="max-w-3xl mx-auto">
              <SurveyPreview 
                questions={questions} 
                onRemoveQuestion={removeQuestion}
                onReorderQuestions={handleReorderQuestions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDesigner;