// highlights.js
const express = require("express");
const router = express.Router();

let highlights = [
  { id: "1", text: "High foot traffic and visibility for retail spaces." },
  {
    id: "2",
    text: "Potential for significant rental income growth due to market demand.",
  },
  { id: "3", text: "Attractive lease terms and incentives for new tenants." },
];

// GET all highlights
router.get("/highlights", (req, res) => {
  res.json(highlights);
});

// POST a new highlight
router.post("/highlights", (req, res) => {
  const { text } = req.body;
  const newHighlight = { id: (highlights.length + 1).toString(), text };
  highlights.push(newHighlight);
  res.status(201).json(newHighlight);
});

// PUT to update a highlight by id
router.put("/highlights/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const highlight = highlights.find((h) => h.id === id);
  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found" });
  }
  highlight.text = text;
  res.json(highlight);
});

// DELETE a highlight by id
router.delete("/highlights/:id", (req, res) => {
  const { id } = req.params;
  highlights = highlights.filter((h) => h.id !== id);
  res.status(204).send();
});

// POST to reorder highlights
router.post("/highlights/reorder", (req, res) => {
  const { reorderedHighlights } = req.body; // expects reordered list
  highlights = reorderedHighlights;
  res.status(200).json(highlights);
});

module.exports = router;
