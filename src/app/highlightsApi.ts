// src/services/highlightsApi.ts
import axios from "axios";

// Define the base URL for the API
const API_URL = "https://sellcre-be.onrender.com/api";

// Define the Highlight type
export interface Highlight {
  id: string;
  text: string;
}

// Function to get all highlights
export const getHighlights = async (): Promise<Highlight[]> => {
  const response = await axios.get<Highlight[]>(`${API_URL}/highlights`);
  return response.data;
};

// Function to add a new highlight
export const addHighlight = async (text: string): Promise<Highlight> => {
  const response = await axios.post<Highlight>(`${API_URL}/highlights`, {
    text,
  });
  return response.data;
};

// Function to update a highlight
export const updateHighlight = async (
  id: string,
  text: string
): Promise<Highlight> => {
  const response = await axios.put<Highlight>(`${API_URL}/highlights/${id}`, {
    text,
  });
  return response.data;
};

// Function to delete a highlight
export const deleteHighlight = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/highlights/${id}`);
};

// Function to reorder highlights
export const reorderHighlights = async (
  reorderedHighlights: Highlight[]
): Promise<Highlight[]> => {
  const response = await axios.post<Highlight[]>(
    `${API_URL}/highlights/reorder`,
    { reorderedHighlights }
  );
  return response.data;
};
