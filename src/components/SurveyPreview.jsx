import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Item type for drag and drop
const QUESTION_TYPE = 'question';

// Draggable Question component
const DraggableQuestion = ({ question, index, moveQuestion, responses, handlers, onRemoveQuestion }) => {
  const ref = useRef(null);
  const { handleRadioChange, handleCheckboxChange, handleTextChange } = handlers;
  
  // Set up drop functionality with improved hover detection
  const [{ handlerId, isOver }, drop] = useDrop({
    accept: QUESTION_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the cursor is significantly past the middle
      // For better UX, use a smaller threshold (15% of item height)
      const threshold = hoverMiddleY * 0.15;
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY + threshold) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY - threshold) {
        return;
      }
      
      // Time to actually perform the action
      moveQuestion(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      item.index = hoverIndex;
    },
  });

  // Improved drag implementation
  const [{ isDragging }, drag] = useDrag({
    type: QUESTION_TYPE,
    item: () => ({ id: question.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Initialize drag-drop refs
  drag(drop(ref));
  
  // Prepare styling for different states
  const getTypeColor = (type) => {
    switch(type) {
      case 'multipleChoice': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'checkboxList': return 'from-purple-50 to-purple-100 border-purple-200';
      case 'shortText': return 'from-green-50 to-green-100 border-green-200';
      case 'longText': return 'from-amber-50 to-amber-100 border-amber-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'multipleChoice': return 'bg-blue-100 text-blue-800';
      case 'checkboxList': return 'bg-purple-100 text-purple-800';
      case 'shortText': return 'bg-green-100 text-green-800';
      case 'longText': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      ref={ref}
      className={`
        border mb-3 rounded-lg shadow-sm
        ${!isDragging ? `bg-white` : ''}
        ${isOver ? 'ring-2 ring-blue-500 shadow-md' : ''}
        ${isDragging ? 'opacity-50 border-dashed border-gray-400' : ''}
        relative transition-all duration-100 ease-in-out
        ${isDragging ? 'transform scale-98' : ''}
      `}
      style={{ 
        padding: '12px',
        opacity: isDragging ? 0.4 : 1,  // Make semi-transparent when dragging instead of invisible
      }}
      data-handler-id={handlerId}
    >
      {/* Drag handle indicator */}
      <div className="absolute left-2 top-0 bottom-0 flex items-center text-gray-400 cursor-grab hover:text-gray-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8m-8 6h8" />
        </svg>
      </div>

      {/* Remove question button */}
      <button 
        onClick={() => onRemoveQuestion(question.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 p-0.5"
        aria-label="Remove question"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Content - Question with number inline */}
      <div className="ml-6 pr-4">
        <h3 className="text-base font-medium mb-2 text-gray-800 flex items-start">
          <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-semibold mr-2 flex-shrink-0 ${getTypeBadgeColor(question.type)}`}>
            {index + 1}
          </span>
          <span className="pt-0.5">{question.text}</span>
        </h3>
        
        {/* Content that fades during dragging but stays visible */}
        <div className={`bg-gray-50 p-2 rounded-md ml-7 transition-opacity ${isDragging ? 'opacity-25' : 'opacity-100'}`}>
          {renderSurveyPreview(question, responses, handlers)}
        </div>
      </div>
    </div>
  );
};

// Drop Zone indicator component
const DropZone = ({ isActive }) => {
  return (
    <div className={`h-2 -mt-1 -mb-1 rounded-full transition-all duration-150 ${isActive ? 'bg-blue-500 scale-100' : 'scale-0'}`} />
  );
};

const SurveyPreview = ({ questions = [], onRemoveQuestion, onReorderQuestions }) => {
  // Track user responses for preview interaction
  const [responses, setResponses] = useState({});
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
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

  // Enhanced move question function with better tracking
  const moveQuestion = useCallback((dragIndex, hoverIndex) => {
    setDraggedIndex(dragIndex);
    setDropTargetIndex(hoverIndex);
    
    onReorderQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const [draggedQuestion] = newQuestions.splice(dragIndex, 1);
      newQuestions.splice(hoverIndex, 0, draggedQuestion);
      return newQuestions;
    });
  }, [onReorderQuestions]);

  // Reset drop target when dragging ends
  const handleDragEnd = useCallback(() => {
    setDropTargetIndex(null);
    setDraggedIndex(null);
  }, []);

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
        <div className="bg-white rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">No questions yet</h3>
        <p className="text-sm mt-1 text-gray-500">Create your first question using the form on the left</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pb-8">
        {/* Initial drop zone */}
        {questions.length > 0 && (
          <DropZone isActive={dropTargetIndex === 0 && draggedIndex !== null} />
        )}
        
        {questions.map((question, index) => (
          <React.Fragment key={question.id}>
            <DraggableQuestion
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
            {/* Insert drop zone after each item */}
            <DropZone isActive={dropTargetIndex === index + 1 && draggedIndex !== null} />
          </React.Fragment>
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
        <div className="space-y-3">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <div className="relative">
                <input 
                  type="radio" 
                  name={`question-${question.id}`}
                  id={`question-${question.id}-option-${i}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={() => handleRadioChange(question.id, option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                />
              </div>
              <label htmlFor={`question-${question.id}-option-${i}`} className="text-gray-700 ml-1 text-base">
                {option}
              </label>
            </div>
          ))}
        </div>
      );
    
    case 'checkboxList':
      const selectedOptions = responses[question.id] || [];
      return (
        <div className="space-y-3">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <div className="relative">
                <input 
                  type="checkbox"
                  id={`question-${question.id}-option-${i}`}
                  checked={selectedOptions.includes(option)}
                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-2"
                />
              </div>
              <label htmlFor={`question-${question.id}-option-${i}`} className="text-gray-700 ml-1 text-base">
                {option}
              </label>
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-base" 
        />
      );
    
    case 'longText':
      return (
        <textarea 
          value={responses[question.id] || ''}
          onChange={(e) => handleTextChange(question.id, e.target.value)}
          placeholder="Long answer text" 
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 h-24 text-base" 
        />
      );
    
    default:
      return null;
  }
};

export default SurveyPreview;