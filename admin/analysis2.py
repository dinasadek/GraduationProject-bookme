#!/usr/bin/env python
# coding: utf-8

# In[1]:

import os
import json
from bson.objectid import ObjectId
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import string
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from nltk import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet, stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from wordcloud import WordCloud
from PIL import Image
import joblib
from pymongo import MongoClient


# In[2]:


from nltk import pos_tag, word_tokenize


# In[3]:


from sklearn.metrics.pairwise import cosine_similarity


# In[4]:


# NLTK Downloads
import nltk
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('vader_lexicon')
nltk.download('punkt')


# In[5]:

client = MongoClient("mongodb+srv://lamiaa:1112002@cluster0.a0d674h.mongodb.net/booking?retryWrites=true&w=majority&appName=Cluster0")
db = client['booking']  # Replace with your database name
hotels_collection = db['hotels']  # Replace with your collection name

users_collection = db['users']  # Replace with your collection name

# Query users data from MongoDB
data = list(users_collection.find())


# In[33]:


# Flatten function
def flatten_reviews(data):
    flattened_data = []
    for item in data:
        flattened_item = {k: v for k, v in item.items() if k not in ['reviews']}
        for i, review in enumerate(item.get('reviews', [])):
            flattened_item[f'review_{i+1}_hotelId'] = review.get('hotelId', '')
            flattened_item[f'review_{i+1}_comment'] = review.get('comment', '')
            flattened_item[f'review_{i+1}_rating'] = review.get('rating', '')
            flattened_item[f'review_{i+1}_hotelName'] = review.get('hotelName', '')
            flattened_item[f'review_{i+1}_date'] = review.get('date', '')
        flattened_data.append(flattened_item)
    return flattened_data

flattened_data = flatten_reviews(data)


# In[34]:


# Convert to DataFrame
df = pd.DataFrame(flattened_data)


# In[37]:


df.head()


# In[38]:


column_names = df.columns

print(column_names)


# In[39]:


df = df.sample(frac = 0.1, replace = False, random_state=42)


# In[40]:


# drop unused column

df = df.drop(['_id','username','email','password','isAdmin','createdAt','updatedAt','__v','country','city','phone','CurrentBookings','HistoryBookings','img','Messages'], axis = 1)


# In[41]:


df.head()


# In[50]:


column_names = df.columns

print(column_names)


# In[51]:


# Reshape the data
reshaped_data = []
columns = ['hotelId', 'comment', 'rating', 'hotelName', 'date']
for i in range(1, int(len(column_names)/5)):
    hotel_data = df[[f'review_{i}_hotelId', f'review_{i}_comment', f'review_{i}_rating', f'review_{i}_hotelName', f'review_{i}_date']]
    hotel_data.columns = columns
    reshaped_data.append(hotel_data)
    
reshaped_df = pd.concat(reshaped_data, ignore_index=True)


# In[52]:


# Drop missing values if any
reshaped_df.dropna(inplace=True)


# In[53]:


# Load stopwords
stopwords_list = set(stopwords.words('english'))


# In[54]:


# Define get_wordnet_pos function
def get_wordnet_pos(pos_tag):
    if pos_tag.startswith('J'):
        return wordnet.ADJ
    elif pos_tag.startswith('V'):
        return wordnet.VERB
    elif pos_tag.startswith('N'):
        return wordnet.NOUN
    elif pos_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN


# In[55]:


# Text cleaning function
def clean_text(text):
    text = text.replace('\t', '').lower()
    text = [word.strip(string.punctuation) for word in text.split(" ")]
    text = [word for word in text if not any(c.isdigit() for c in word)]
    text = [x for x in text if x not in stopwords_list]
    text = [t for t in text if len(t) > 0]
    pos_tags = pos_tag(text)
    text = [WordNetLemmatizer().lemmatize(t[0], get_wordnet_pos(t[1])) for t in pos_tags]
    text = [t for t in text if len(t) > 1]
    return ' '.join(text)

reshaped_df['Clean_Comment'] = reshaped_df['comment'].apply(lambda x: clean_text(x))


# In[56]:


reshaped_df.head()


# In[57]:


# Sentiment analysis
sid = SentimentIntensityAnalyzer()
reshaped_df['Sentiments'] = reshaped_df['comment'].apply(lambda x: sid.polarity_scores(x))
reshaped_df = pd.concat([reshaped_df.drop(['Sentiments'], axis=1), reshaped_df['Sentiments'].apply(pd.Series)], axis=1)


# In[58]:


# TF-IDF vectorization
tfidf = TfidfVectorizer(min_df=10)
tfidf_result = tfidf.fit_transform(reshaped_df['Clean_Comment']).toarray()
tfidf_df = pd.DataFrame(tfidf_result, columns=tfidf.get_feature_names_out())
tfidf_df.columns = ['word_' + str(x) for x in tfidf_df.columns]
tfidf_df.index = reshaped_df.index
reshaped_df = pd.concat([reshaped_df, tfidf_df], axis=1)


# In[59]:


# Create positive and negative labels
reshaped_df['posneg'] = reshaped_df['rating'].apply(lambda x: 0 if x < 5 else 1)


# In[60]:


reshaped_df.head()


# In[61]:


# Split and train models for each hotel separately
unique_hotels = reshaped_df['hotelId'].unique()


# In[63]:


for hotel in unique_hotels:
    hotel_data = reshaped_df[reshaped_df['hotelId'] == hotel]
    
    # Check if there are enough samples for a train-test split
    if len(hotel_data) < 2:
        print(f"Skipping Hotel ID: {hotel} due to insufficient data")
        continue
    
    # Drop non-numeric columns
    X = hotel_data.drop(['posneg', 'hotelId', 'comment', 'hotelName', 'date', 'Clean_Comment'], axis=1)
    Y = hotel_data['posneg']
    
    # Adjust test_size based on the number of samples
    if len(hotel_data) < 4:
        test_size = 0.5
    else:
        test_size = 0.25
    
    # Random Forest model
    X_train_rf, X_test_rf, y_train_rf, y_test_rf = train_test_split(X, Y, test_size=test_size, random_state=42)
    rf_model = RandomForestClassifier(random_state=42)
    rf_model.fit(X_train_rf, y_train_rf)
    preds_rf = rf_model.predict(X_test_rf)
    print(f"Hotel ID: {hotel} - Random Forest Classification Report")
    print(classification_report(y_test_rf, preds_rf))


# In[64]:


# Analyze results for each hotel
hotel_results = reshaped_df.groupby('hotelId').agg({
    'posneg': ['sum', 'count'],
    'rating': 'mean',
    'date': 'count'
})
hotel_results.columns = ['Positive_Comments', 'Total_Comments', 'Average_Rating', 'Total_Reviews']
hotel_results['Negative_Comments'] = hotel_results['Total_Comments'] - hotel_results['Positive_Comments']
hotel_results['Positive_Ratio'] = hotel_results['Positive_Comments'] / hotel_results['Total_Comments']

print(hotel_results)


# In[65]:


# Separate positive and negative comments
reshaped_df['is_positive'] = reshaped_df['posneg'] == 1
reshaped_df['is_negative'] = reshaped_df['posneg'] == -1


# In[67]:


# Performance over time for each hotel
reshaped_df['date'] = pd.to_datetime(reshaped_df['date'])
performance_over_time = reshaped_df.groupby(['hotelId', pd.Grouper(key='date', freq='M')]).agg({
    'is_positive': 'sum',
    'is_negative': 'sum',
    'posneg': 'count'
}).reset_index()


# In[68]:


# Rename the columns for clarity
performance_over_time.columns = ['hotelId', 'date', 'Positive_Comments', 'Negative_Comments', 'Total_Comments']


# In[69]:


# Calculate the positive and negative ratios over time
performance_over_time['Positive_Ratio'] = performance_over_time['Positive_Comments'] / performance_over_time['Total_Comments']
performance_over_time['Negative_Ratio'] = performance_over_time['Negative_Comments'] / performance_over_time['Total_Comments']


# In[70]:


# Display the performance over time
print(performance_over_time)


# In[71]:


# Analyze aspects for each hotel separately
hotel_aspect_analysis = {}

for hotel_id, group in reshaped_df.groupby('hotelId'):
    aspect_counts = {}
    for comment in group['Clean_Comment']:
        tokens = word_tokenize(comment)
        pos_tags = pos_tag(tokens)
        for word, tag in pos_tags:
            if tag.startswith('NN'):  # Nouns
                if word not in aspect_counts:
                    aspect_counts[word] = 0
                aspect_counts[word] += 1
    
    
    # Filter aspects based on frequency
    filtered_aspects = {k: v for k, v in aspect_counts.items() if v > 1}  # Adjust the threshold as needed
    aspect_sentiments = {aspect: [] for aspect in filtered_aspects}
    
    # Perform aspect-based sentiment analysis
    for index, row in group.iterrows():
        comment = row['Clean_Comment']
        for aspect in filtered_aspects:
            if aspect in comment:
                sentiment = sid.polarity_scores(comment)['compound']
                aspect_sentiments[aspect].append(sentiment)
    
    # Aggregate aspect sentiments and print results
    aspect_summary = []
    for aspect, sentiments in aspect_sentiments.items():
        if sentiments:
            avg_sentiment = sum(sentiments) / len(sentiments)
            sentiment_std = np.std(sentiments)
            positive_mentions = sum(1 for s in sentiments if s > 0)
            negative_mentions = sum(1 for s in sentiments if s < 0)
            neutral_mentions = sum(1 for s in sentiments if s == 0)
            aspect_summary.append((
                aspect, 
                avg_sentiment, 
                len(sentiments), 
                positive_mentions, 
                negative_mentions, 
                neutral_mentions, 
                sentiment_std
            ))
    aspect_summary = sorted(aspect_summary, key=lambda x: x[1], reverse=True)
    
    # Store the aspect summary for the hotel
    hotel_aspect_analysis[hotel_id] = pd.DataFrame(aspect_summary, columns=[
        'Aspect', 
        'Average Sentiment', 
        'Mentions', 
        'Positive Mentions', 
        'Negative Mentions', 
        'Neutral Mentions', 
        'Sentiment Std Dev'
    ])


# In[72]:


# Print aspect analysis for each hotel
for hotel_id, summary_df in hotel_aspect_analysis.items():
    print(f"Hotel ID: {hotel_id}")
    print(summary_df)
    print("\n")


# In[73]:


# Bar Chart for Positive and Negative Comments
plt.figure(figsize=(30, 16))
hotel_results[['Positive_Comments', 'Negative_Comments']].plot(kind='bar', stacked=True)
plt.title('Positive and Negative Comments per Hotel')
plt.xlabel('Hotel ID')
plt.ylabel('Number of Comments')
plt.xticks(rotation=90)



# In[74]:


# # Scatter Plot for Average Rating vs Positive Ratio
# plt.figure(figsize=(10, 6))
# sns.scatterplot(data=hotel_results, x='Average_Rating', y='Positive_Ratio', hue='Total_Comments', size='Total_Reviews', sizes=(20, 200))
# plt.title('Average Rating vs Positive Ratio')
# plt.xlabel('Average Rating')
# plt.ylabel('Positive Ratio')
# plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
# plt.show()


# In[75]:


# Heatmap for the Hotel Data
plt.figure(figsize=(12, 8))
sns.heatmap(hotel_results[['Positive_Comments', 'Negative_Comments', 'Average_Rating', 'Positive_Ratio']], annot=True, cmap='coolwarm')
plt.title('Heatmap of Hotel Comments, Ratings, and Ratios')
plt.xlabel('Metrics')
plt.ylabel('Hotel ID')




# In[78]:


total_positive = hotel_results['Positive_Comments'].sum()
total_negative = hotel_results['Negative_Comments'].sum()
plt.figure(figsize=(8, 8))
plt.pie([total_positive, total_negative], labels=['Positive Comments', 'Negative Comments'], autopct='%1.1f%%', startangle=140, colors=['g', 'r'])
plt.title('Overall Sentiment Distribution')


# Directory to save plots
plots_dir = 'C:/Users/user/Desktop/book/GraduationProject-bookme/admin/public/plots'
os.makedirs(plots_dir, exist_ok=True)

# Bar Chart for Positive and Negative Comments
plt.figure(figsize=(30, 16))
hotel_results[['Positive_Comments', 'Negative_Comments']].plot(kind='bar', stacked=True)
plt.title('Positive and Negative Comments per Hotel')
plt.xlabel('Hotel ID')
plt.ylabel('Number of Comments')
plt.xticks(rotation=90)
plt.savefig(os.path.join(plots_dir, 'positive_negative_comments.png'))
plt.close()



# Heatmap for the Hotel Data
plt.figure(figsize=(12, 8))
sns.heatmap(hotel_results[['Positive_Comments', 'Negative_Comments', 'Average_Rating', 'Positive_Ratio']], annot=True, cmap='coolwarm')
plt.title('Heatmap of Hotel Comments, Ratings, and Ratios')
plt.xlabel('Metrics')
plt.ylabel('Hotel ID')
plt.savefig(os.path.join(plots_dir, 'heatmap_hotel_comments.png'))
plt.close()

# Heatmap for Average Rating and Positive Ratio
plt.figure(figsize=(10, 6))
sns.heatmap(hotel_results[['Average_Rating', 'Positive_Ratio']], annot=True, cmap='coolwarm')
plt.title('Heatmap of Average Rating and Positive Ratio')
plt.savefig(os.path.join(plots_dir, 'heatmap_rating_ratio.png'))
plt.close()

# Pie Chart for overall sentiment distribution
total_positive = hotel_results['Positive_Comments'].sum()
total_negative = hotel_results['Negative_Comments'].sum()
plt.figure(figsize=(8, 8))
plt.pie([total_positive, total_negative], labels=['Positive Comments', 'Negative Comments'], autopct='%1.1f%%', startangle=140, colors=['g', 'r'])
plt.title('Overall Sentiment Distribution')
plt.savefig(os.path.join(plots_dir, 'sentiment_distribution.png'))
plt.close()