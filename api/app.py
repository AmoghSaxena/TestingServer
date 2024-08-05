from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from recommender import ContentBasedRecommender

app = Flask(__name__)
CORS(app)  

articles_df = pd.read_csv('../data/articles.csv')

recommender = ContentBasedRecommender(articles_df)

@app.route('/recommend', methods=['POST'])
def recommend_articles():
    data = request.get_json()
    user_id = data['userId']
    
    recommended_articles = recommender.recommend_articles(user_id)
    
    return jsonify(recommended_articles)

if __name__ == '__main__':
    app.run()
