// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [articles, setArticles] = useState([]);
  const userId = 'user1'; // Replace with actual user ID

  useEffect(() => {
    // Fetch recommended articles on component mount
    fetchRecommendedArticles();
  }, []);

  const fetchRecommendedArticles = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/recommendations/${userId}`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching recommended articles:', error);
    }
  };

  const handleArticleClick = async (article) => {
    try {
      // Update user profile when an article is clicked
      await axios.post('http://localhost:3000/api/profile', {
        userId,
        articles: [article],
      });
      // Fetch updated recommendations
      fetchRecommendedArticles();
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div>
      <h1>Recommended Articles</h1>
      {articles.map((article, index) => (
        <div key={index} onClick={() => handleArticleClick(article)}>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
