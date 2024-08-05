import React, { useState, useEffect } from 'react';
import NewsArticle from './NewsArticle';

const App = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const response = await fetch('https://your-api-url.vercel.app/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }),
      });

      const data = await response.json();
      setArticles(data);
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <h1>Recommended Articles</h1>
      {articles.map((article) => (
        <NewsArticle key={article.id} article={article} />
      ))}
    </div>
  );
};

export default App;
