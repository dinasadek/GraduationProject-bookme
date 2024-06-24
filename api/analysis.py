#!/usr/bin/env python
# coding: utf-8

# In[1]:

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


# In[6]:


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


# In[7]:


# Convert to DataFrame
df = pd.DataFrame(flattened_data)


# In[8]:


df.head()


# In[9]:


column_names = df.columns

print(column_names)


# In[10]:


df = df.sample(frac = 0.1, replace = False, random_state=42)


# In[11]:


# drop unused column

df = df.drop(['_id','username','email','password','isAdmin','createdAt','updatedAt','__v','country','city','phone','CurrentBookings','HistoryBookings','img','Messages'], axis = 1)


# In[12]:


df.head()


# In[13]:


column_names = df.columns

print(column_names)


# In[14]:


# Reshape the data
reshaped_data = []
columns = ['hotelId', 'comment', 'rating', 'hotelName', 'date']
for i in range(1,  int(len(column_names)/5)):
    hotel_data = df[[f'review_{i}_hotelId', f'review_{i}_comment', f'review_{i}_rating', f'review_{i}_hotelName', f'review_{i}_date']]
    hotel_data.columns = columns
    reshaped_data.append(hotel_data)
    
reshaped_df = pd.concat(reshaped_data, ignore_index=True)


# In[15]:


# Drop missing values if any
reshaped_df.dropna(inplace=True)


# In[16]:


# Load stopwords
stopwords_list = set(stopwords.words('english'))


# In[17]:


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


# In[18]:


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


# In[19]:


reshaped_df.head()


# In[20]:


# Sentiment analysis
sid = SentimentIntensityAnalyzer()
reshaped_df['Sentiments'] = reshaped_df['comment'].apply(lambda x: sid.polarity_scores(x))
reshaped_df = pd.concat([reshaped_df.drop(['Sentiments'], axis=1), reshaped_df['Sentiments'].apply(pd.Series)], axis=1)


# In[21]:


# TF-IDF vectorization
tfidf = TfidfVectorizer(min_df=10)
tfidf_result = tfidf.fit_transform(reshaped_df['Clean_Comment']).toarray()
tfidf_df = pd.DataFrame(tfidf_result, columns=tfidf.get_feature_names_out())
tfidf_df.columns = ['word_' + str(x) for x in tfidf_df.columns]
tfidf_df.index = reshaped_df.index
reshaped_df = pd.concat([reshaped_df, tfidf_df], axis=1)


# In[22]:


# Create positive and negative labels
reshaped_df['posneg'] = reshaped_df['rating'].apply(lambda x: 0 if x < 5 else 1)


# In[23]:


reshaped_df.head()


# In[24]:


# Split and train models for each hotel separately
unique_hotels = reshaped_df['hotelId'].unique()


# In[25]:


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


# In[26]:


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


# Sort by Average_Rating and get the top 5 hotels
top_5_average_rating = hotel_results.sort_values(by='Average_Rating', ascending=False).head(5)

# Sort by Positive_Ratio and get the top 5 hotels
top_5_positive_ratio = hotel_results.sort_values(by='Positive_Ratio', ascending=False).head(5)

# Find the intersection of hotel IDs in both lists
intersection_hotels = top_5_average_rating.index.intersection(top_5_positive_ratio.index)

print("Intersection of top 5 hotels by Average Rating and Positive Ratio:")
intersection_results = hotel_results.loc[intersection_hotels][['Average_Rating', 'Positive_Ratio']]
print(intersection_results)
top_5_hotel_ids = intersection_results.index.tolist()
print("Top 5 hotel IDs:", top_5_hotel_ids)


# Function to update hotels to featured: true based on given IDs
def update_hotels_to_featured(top_hotel_ids):
    try:

        # Update all hotels to featured: false initially
        hotels_collection.update_many({}, {'$set': {'featured': False}})
        print("All hotels set to featured: false initially.")

        for hotel_id in top_hotel_ids:
            # Convert hotel_id to ObjectId (assuming hotel_id is a string)
            hotel_id_obj = ObjectId(hotel_id)
            
            # Update hotel document
            updated_hotel = hotels_collection.find_one_and_update(
                {'_id': hotel_id_obj},
                {'$set': {'featured': True}},
                return_document=True  # Return the updated document
            )
            print(f"Hotel ID {hotel_id} updated as featured.")
    except Exception as err:
        print(f"Error updating hotel ID {hotel_id}: {err}")

# Call the function to update hotels to featured: true
update_hotels_to_featured(top_5_hotel_ids)