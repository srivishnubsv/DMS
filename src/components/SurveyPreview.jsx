import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Item type for drag and drop
const QUESTION_TYPE = 'question';

// Draggable Question component
const DraggableQuestion = ({ question, index, moveQuestion, responses, handlers, onRemoveQuestion }) => {
  const ref = useRef(null);
  const { handleRadioChange, handleCheckboxChange, handleTextChange } = handlers;
  
  const [{ isDragging }, drag] = useDrag({
    type: QUESTION_TYPE,
    item: () => ({ id: question.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: QUESTION_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Move the item when the cursor is at 30% of the item height
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // When dragging more than 30% past the midpoint, perform the move
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY * 0.7) {
        moveQuestion(dragIndex, hoverIndex);
        item.index = hoverIndex;
        return;
      }

      // When dragging less than 30% before the midpoint, perform the move
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY * 1.3) {
        moveQuestion(dragIndex, hoverIndex);
        item.index = hoverIndex;
        return;
      }

      // When within the middle zone (30% around the midpoint), move immediately
      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Initialize drag-drop refs
  drag(drop(ref));
  
  return (
    <div 
      ref={ref}
      className={`border p-4 rounded-lg ${
        isDragging ? 'bg-blue-50 border-blue-400 border-2 shadow-lg opacity-50' : 
        isOver ? 'bg-gray-100 border-gray-300' : 'bg-gray-50'
      } relative mb-4 transition-colors duration-150`}
      style={{ cursor: 'move' }}
      data-handler-id={question.id}
    >
      {/* Grip handle for drag indicator */}
      <div className="absolute left-2 top-0 bottom-0 flex items-center text-gray-400 cursor-grab">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8m-8 6h8" />
        </svg>
      </div>

      {/* Remove question button */}
      <button 
        onClick={() => onRemoveQuestion(question.id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        aria-label="Remove question"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div className="mb-3 ml-8">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {index + 1}. {getQuestionTypeLabel(question.type)}
        </span>
      </div>
      
      <h3 className="text-lg font-medium mb-3 ml-8">{question.text}</h3>
      
      <div className="ml-8">
        {renderSurveyPreview(question, responses, handlers)}
      </div>
    </div>
  );
};

const SurveyPreview = ({ questions = [], onRemoveQuestion, onReorderQuestions }) => {
  // Track user responses for preview interaction
  const [responses, setResponses] = useState({});
  
  // Handle radio button changes
  const handleRadioChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (questionId, value, isChecked) => {
    const currentSelections = responses[questionId] || [];
    let newSelections;
    
    if (isChecked) {
      newSelections = [...currentSelections, value];
    } else {
      newSelections = currentSelections.filter(item => item !== value);
    }
    
    setResponses({
      ...responses,
      [questionId]: newSelections
    });
  };

  // Handle text input changes
  const handleTextChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const moveQuestion = useCallback((dragIndex, hoverIndex) => {
    const reorderedQuestions = [...questions];
    const [draggedItem] = reorderedQuestions.splice(dragIndex, 1);
    reorderedQuestions.splice(hoverIndex, 0, draggedItem);
    onReorderQuestions(reorderedQuestions);
  }, [questions, onReorderQuestions]);

  if (questions.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>No questions added yet.</p>
        <p className="text-sm mt-1">Use the form on the left to add questions.</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {questions.map((question, index) => (
          <DraggableQuestion
            key={question.id}
            question={question}
            index={index}
            moveQuestion={moveQuestion}
            responses={responses}
            handlers={{
              handleRadioChange,
              handleCheckboxChange,
              handleTextChange
            }}
            onRemoveQuestion={onRemoveQuestion}
          />
        ))}
      </div>
    </DndProvider>
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
const renderSurveyPreview = (question, responses, handlers) => {
  const { handleRadioChange, handleCheckboxChange, handleTextChange } = handlers;

  switch (question.type) {
    case 'multipleChoice':
      return (
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                id={`question-${question.id}-option-${i}`}
                value={option}
                checked={responses[question.id] === option}
                onChange={() => handleRadioChange(question.id, option)}
                className="mr-2" 
              />
              <label htmlFor={`question-${question.id}-option-${i}`}>{option}</label>
            </div>
          ))}
        </div>
      );
    
    case 'checkboxList':
      const selectedOptions = responses[question.id] || [];
      return (
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <input 
                type="checkbox"
                id={`question-${question.id}-option-${i}`}
                checked={selectedOptions.includes(option)}
                onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                className="mr-2" 
              />
              <label htmlFor={`question-${question.id}-option-${i}`}>{option}</label>
            </div>
          ))}
        </div>
      );
    
    case 'shortText':
      return (
        <input 
          type="text" 
          value={responses[question.id] || ''}
          onChange={(e) => handleTextChange(question.id, e.target.value)}
          placeholder="Short answer text" 
          className="w-full p-2 border rounded" 
        />
      );
    
    case 'longText':
      return (
        <textarea 
          value={responses[question.id] || ''}
          onChange={(e) => handleTextChange(question.id, e.target.value)}
          placeholder="Long answer text" 
          className="w-full p-2 border rounded h-24" 
        />
      );
    
    default:
      return null;
  }
};

export default SurveyPreview;