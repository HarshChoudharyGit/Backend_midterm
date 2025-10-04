require('dotenv').config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";

const apiKey = process.env.CHATGROQ_API_KEY;

const llm = new ChatGroq({
  apiKey,
  model: "llama-3.3-70b-versatile",
  maxTokens: undefined,
  maxRetries: 2,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "{input} .Kindly provide me the data with respect to the location {output_language} on date {input_language}."],
  ["human", "{input}"]
]);
//"You are a helpful travel planning assistant that tells the Weather forecasting for the place {output_language} on date {input_language}.Provide me a short one line answer and the suggestions whether i should travel or not?Also tell me a rough budget estimate for the trip.also provide me a step by step iternary guide(for eg:day1:sightseeing,day2:shopping etc).Also provide me a neat trip summary card in a table format with each information being displayed in a new line such as trip summary card starting from a new line,weather forecasting from another line with proper headings.Also determine the travel routes and travel cost to travel from {location} to {output_language}"
const chain = prompt.pipe(llm);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { date, location, query } = req.body;
  try {
    const result = await chain.invoke({
      input_language: date,
      output_language: location,
      location:query,
      input: query
    });
    console.log("/chat response:", result.content);
    res.json({ reply: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Weather Info
app.post("/weather", async (req, res) => {
  const { date, location } = req.body;
  try {
    const result = await chain.invoke({
      input_language: date,
      output_language: location,
      input: "Give me only the weather forecast and travel suggestion."
    });
    console.log("/weather response:", result.content);
    res.json({ weather: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route Info
app.post("/route", async (req, res) => {
  const { date, location } = req.body;
  try {
    const result = await chain.invoke({
      input_language: date,
      output_language: location,
      input: "Give me only the route information and travel time with intial location being ALLAHABAD.Give each route with intial and final location"
    });
    console.log("/route response:", result.content);
    res.json({ route: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Budget Info
app.post("/budget", async (req, res) => {
  const { date, location } = req.body;
  try {
    const result = await chain.invoke({
      input_language: date,
      output_language: location,
      input: "Give me only the budget estimate for the trip in rupees with rupees sign and cost breakdown in a key pair format with a total amount"
    });
    console.log("/budget response:", result.content);
    res.json({ budget: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events Info
app.post("/events", async (req, res) => {
  const { date, location } = req.body;
  try {
    const result = await chain.invoke({
      input_language: date,
      output_language: location,
      input: "Give me only the events and activities happening during the trip."
    });
    console.log("/events response:", result.content);
    res.json({ events: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Itinerary Info
app.post("/itinerary", async (req, res) => {
  const { date, location } = req.body;
  try {
    const result = await chain.invoke({
      input_language: date,
      output_language: location,
      input: "Give me only the day-by-day itinerary for the trip."
    });
    console.log("/itinerary response:", result.content);
    res.json({ itinerary: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});