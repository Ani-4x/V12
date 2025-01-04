from fastapi import FastAPI
import pandas as pd 
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import io
import base64

app = FastAPI()

#sample

data = {'X' : [1,2,3,4,5], 'Y':[2,4,6,8,10]}
df = pd.DataFrame(data)


X = df[['X']]
y = df['Y']
model = LinearRegression().fit(X,y)

@app.get("/predict")
def predict():
  prediction = model.predict([[6]])
  return{'predicition': prediction[0]}

@app.get('/visualize')
def visualize():
    plt.figure(figsize=(6,4))
    plt.scatter(df['X'], df['Y'], color='blue')
    plt.plot(df['X'], model.predict(X), color='red')
    plt.title('linear reg')
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='jpg')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.read()).decode()
    buffer.close()
    return {"img": f"data:image/jpg;base64,{img_str}"}
