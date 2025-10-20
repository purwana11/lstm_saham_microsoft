from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
import joblib

app = Flask(__name__)

# === Load Model & Scaler ===
model = load_model("model_lstm_microsoft.h5")
scaler = joblib.load("scaler_microsoft.pkl")

# === Load Dataset ===
df = pd.read_csv("Microsoft_Stock.csv")
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values('Date', ascending=True)  # untuk chart: urutan naik

@app.route('/')
def index():
    df_sorted = df.copy()
    df_sorted['Date'] = df_sorted['Date'].dt.strftime('%Y-%m-%d')

    chart_data = df_sorted[['Date', 'Close']].to_dict(orient='records')
    table_data = df_sorted.to_dict(orient='records')  # tampilkan semua data

    return render_template('index.html', chart_data=chart_data, data=table_data)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        user_input = request.form['prices']
        prices = [float(x.strip()) for x in user_input.split(',') if x.strip()]

        if len(prices) < 5:
            return render_template('result.html', error="Masukkan minimal 5 harga penutupan.")

        arr = np.array(prices).reshape(-1, 1)
        scaled = scaler.transform(arr)
        if len(scaled) < 60:
            pad = np.zeros((60 - len(scaled), 1))
            scaled = np.vstack((pad, scaled))

        X_input = np.array([scaled])
        pred_scaled = model.predict(X_input)
        pred = scaler.inverse_transform(pred_scaled)[0][0]

        return render_template('result.html', prediction=f"{pred:.2f}", prices=prices)

    except Exception as e:
        return render_template('result.html', error=f"Terjadi kesalahan: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)
