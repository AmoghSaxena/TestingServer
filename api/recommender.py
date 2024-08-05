import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ContentBasedRecommender:
    def __init__(self, articles_df):
        self.articles_df = articles_df
        self.tfidf_matrix = self.create_tfidf_matrix(articles_df)
        
    def create_tfidf_matrix(self, articles_df):
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(articles_df['content'])
        return tfidf_matrix
    
    def recommend_articles(self, user_id, top_n=5):
        user_articles = self.articles_df[self.articles_df['user_id'] == user_id]
        
        if len(user_articles) == 0:
            return []
        
        user_tfidf = self.tfidf_matrix[user_articles.index[0]]
        
        similarity_scores = cosine_similarity(user_tfidf, self.tfidf_matrix)
        similarity_scores = similarity_scores.flatten()
        
        article_indices = similarity_scores.argsort()[::-1][:top_n]
        recommended_articles = self.articles_df.iloc[article_indices].to_dict('records')
        
        return recommended_articles
