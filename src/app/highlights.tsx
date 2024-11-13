"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

// SortableItem component to make each item draggable only when clicking on the order icon
const SortableItem = ({
  highlight,
  onEdit,
  onDelete,
}: {
  highlight: Highlight;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: highlight.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "22px 8px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Draggable Icon - Apply drag listeners here */}
      <img
        src="/order.svg"
        alt="Drag to reorder"
        className="mr-3 h-5 w-5 cursor-move"
        {...listeners} // Apply listeners here
      />

      {/* Highlight Text Input */}
      <input
        type="text"
        value={highlight.text}
        onChange={(e) => onEdit(highlight.id, e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded text-[14px] text-[#4E5864]"
      />

      {/* Delete Button */}
      <button
        onClick={() => onDelete(highlight.id)}
        className="ml-2"
        aria-label="Delete highlight"
      >
        <img src="/recycle.svg" alt="Delete" className="h-5 w-5" />
      </button>
    </div>
  );
};

const Highlights: React.FC = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Fetch highlights from the backend when the component mounts
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await getHighlights();
        setHighlights(data);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };
    fetchHighlights();
  }, []);

  // Sensors for drag and drop
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle drag end to reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setHighlights((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        reorderHighlights(reordered); // Send reordered list to the backend
        return reordered;
      });
    }
  };

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={highlights.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {highlights.map((highlight) => (
            <SortableItem
              key={highlight.id}
              highlight={highlight}
              onEdit={handleEditHighlight}
              onDelete={handleDeleteHighlight}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Highlights;
