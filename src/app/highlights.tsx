"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  getHighlights,
  addHighlight,
  updateHighlight,
  deleteHighlight,
  reorderHighlights,
} from "./highlightsApi";

type Highlight = {
  id: string;
  text: string;
};

const Highlights: React.FC = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Fetch highlights from the backend when the component mounts
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await getHighlights();
        console.log("Setting highlights:", data); // Add this line
        setHighlights(data);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };
    fetchHighlights();
  }, []);

  // Add a new highlight
  const handleAddHighlight = async () => {
    try {
      const newHighlight = await addHighlight("New highlight text");
      setHighlights((prev) => [...prev, newHighlight]);
    } catch (error) {
      console.error("Error adding highlight:", error);
    }
  };

  // Edit an existing highlight
  const handleEditHighlight = async (id: string, newText: string) => {
    setHighlights((prev) =>
      prev.map((highlight) =>
        highlight.id === id ? { ...highlight, text: newText } : highlight
      )
    );
    updateHighlight(id, newText);
  };

  // Delete a highlight
  const handleDeleteHighlight = async (id: string) => {
    try {
      await deleteHighlight(id);
      setHighlights((prev) => prev.filter((highlight) => highlight.id !== id));
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  // Reorder highlights on drag and drop
  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedHighlights = Array.from(highlights);
    const [reorderedItem] = reorderedHighlights.splice(result.source.index, 1);
    reorderedHighlights.splice(result.destination.index, 0, reorderedItem);

    // Update highlights locally for instant feedback
    setHighlights(reorderedHighlights);

    // Send the reordered highlights to the backend
    try {
      await reorderHighlights(reorderedHighlights);
    } catch (error) {
      console.error("Error reordering highlights:", error);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-10 border border-gray-300 bg-white">
      <div className="flex justify-between items-center p-6">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <h2 className="text-[20px] font-semibold text-[#7261FF] leading-[15.72px]">
            Property Highlights
          </h2>
          <img
            src="/info.svg"
            alt="Information about property highlights"
            className="h-4 w-4"
          />
        </div>

        {/* Add Highlight Button */}
        <button
          onClick={handleAddHighlight}
          className="flex items-center px-4 py-2 bg-[#7261FF] text-white rounded-lg hover:bg-purple-700 space-x-2"
        >
          <span>+</span> <span>Add Highlight</span>
        </button>
      </div>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="highlights">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {highlights.map((highlight, index) => (
                <Draggable
                  key={highlight.id}
                  draggableId={highlight.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center p-4 border border-gray-200"
                    >
                      {/* Draggable Icon */}
                      <img
                        src="/order.svg"
                        alt="Drag to reorder"
                        className="mr-3 h-5 w-5 cursor-move"
                      />

                      {/* Highlight Text Input */}
                      <input
                        type="text"
                        value={highlight.text}
                        onChange={(e) =>
                          handleEditHighlight(highlight.id, e.target.value)
                        }
                        className="flex-1 p-2 border border-gray-300 rounded text-[14px] text-[#4E5864]"
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteHighlight(highlight.id)}
                        className="ml-3"
                        aria-label="Delete highlight"
                      >
                        <img
                          src="/recycle.svg"
                          alt="Delete"
                          className="h-5 w-5"
                        />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Highlights;
