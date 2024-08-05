// server.js
const express = require('express');
const axios = require('axios');
const natural = require('natural');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// NewsAPI endpoint and API key
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything';
const API_KEY = 'YOUR_API_KEY';

// TF-IDF vectorizer
const tfidf = new natural.TfIdf();

// User profiles (simulated)
const userProfiles = {
  user1: [],
  user2: [],
  // Add more users as needed
};

// Function to fetch news articles from NewsAPI
async function fetchNewsArticles(query) {
  try {
    const response = await axios.get(NEWS_API_ENDPOINT, {
      params: {
        q: query,
        apiKey: API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
}

// Function to update user profile based on read articles
function updateUserProfile(userId, articles) {
  articles.forEach((article) => {
    // Extract keywords from article title and description
    const text = `${article.title} ${article.description}`;
    const keywords = tfidf.addDocument(text);

    // Add keywords to user profile
    userProfiles[userId].push(...keywords);
  });
}

// Function to recommend articles based on user profile
async function recommendArticles(userId) {
  const userKeywords = userProfiles[userId];
  const recommendedArticles = [];

  // Fetch news articles based on user keywords
  for (const keyword of userKeywords) {
    const articles = await fetchNewsArticles(keyword);
    recommendedArticles.push(...articles);
  }

  // Remove duplicates and return recommended articles
  return [...new Set(recommendedArticles)];
}

// API endpoint to get recommended articles for a user
app.get('/api/recommendations/:userId', async (req, res) => {
  const userId = req.params.userId;
  const recommendedArticles = await recommendArticles(userId);
  res.json(recommendedArticles);
});

// API endpoint to update user profile
app.post('/api/profile', (req, res) => {
  const { userId, articles } = req.body;
  updateUserProfile(userId, articles);
  res.sendStatus(200);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
