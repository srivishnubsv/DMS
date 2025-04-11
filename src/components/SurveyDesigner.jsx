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

  const handleReorderQuestions = (reorderedQuestions) => {
    setQuestions(reorderedQuestions);
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
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex overflow-hidden">
        {/* Left column - Question Designer (1/3 width) */}
        <div className="w-1/3 bg-white shadow-md p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white z-10 py-2">Add Questions</h2>
          <div className="pb-12">
            <QuestionDesigner onAddQuestion={addQuestion} />
          </div>
        </div>
        
        {/* Right column - Question Preview (2/3 width) */}
        <div className="w-2/3 bg-gray-50 border-l">
          <div className="p-6 sticky top-0 bg-white z-10 border-b">
            <input
              type="text"
              className="w-full p-2 text-xl font-medium border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Enter survey title..."
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-600 text-sm">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div 
            ref={previewContainerRef}
            className="overflow-y-auto p-6 pb-24" 
            style={{ height: 'calc(100vh - 88px)' }} 
          >
            <SurveyPreview 
              questions={questions} 
              onRemoveQuestion={removeQuestion}
              onReorderQuestions={handleReorderQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDesigner;