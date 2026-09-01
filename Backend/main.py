from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

import pandas as pd
import os
import math

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

class QuestionRequest(BaseModel):
    question: str

dataset_context = ""
dataset_df = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["*"],
    allow_credentials=True,
)

@app.get("/")
def home():
    return {
        "message": "AI-Powered-Data-Analyst FastAPI is Running."
    }

@app.get("/test")
def test():
    return {
        "message": "Hello from FASTAPI."
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    global dataset_context
    global dataset_df

    df = pd.read_csv(file.file)

    dataset_df = df

    missing_values = int(df.isnull().sum().sum())

    duplicate_rows = int(df.duplicated().sum())

    data_types = (
        df.dtypes
        .astype(str)
        .to_dict()
    )

    numeric_columns = (
        df.select_dtypes(include="number")
        .columns
        .tolist()
    )

    categorical_columns = (
        df.select_dtypes(include=["object", "category"])
        .columns
        .tolist()
    )

    statistics = df.describe(
        include="all"
    ).fillna("").to_dict()

    if len(numeric_columns) >= 2:
        correlation = df[numeric_columns].corr()
        correlation_data = correlation.fillna(0).round(3).to_dict()
    else:
        correlation_data = {}

    chart_data = {}

    if numeric_columns:

        selected_numeric = numeric_columns[:5]

        chart_data["numeric"] = {
            column: [
                None if pd.isna(value) else float(value)
                for value in df[column].head(20)
            ]
            for column in selected_numeric
        }

    if categorical_columns:

        category_column = categorical_columns[0]

        category_counts = (
            df[category_column]
            .fillna("Unknown")
            .astype(str)
            .value_counts()
            .head(10)
        )

        chart_data["categorical"] = {
            "column": category_column,
            "labels": category_counts.index.tolist(),
            "values": category_counts.values.tolist()
        }

    preview_df = df.head(10).copy()

    preview_df = preview_df.fillna("")

    preview_data = {
        "columns": preview_df.columns.tolist(),
        "rows": preview_df.astype(str).to_dict(orient="records")
    }

    dataset_summary = f"""
Dataset has {len(df)} rows and {len(df.columns)} columns.

Columns:
{df.columns.tolist()}

Missing values:
{missing_values}

Duplicate rows:
{duplicate_rows}

Numerical columns:
{numeric_columns}

Categorical columns:
{categorical_columns}

Data Types:
{data_types}

Statistics:
{statistics}

Correlation:
{correlation_data}
"""

    dataset_context = dataset_summary

    ai_response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"""
You are an expert data analyst.

Analyze the following dataset summary and provide
5 important insights about the dataset.

Keep the explanation simple and practical.

Dataset Summary:
{dataset_summary}
"""
    )

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": df.columns.tolist(),
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "data_types": data_types,
        "statistics": statistics,
        "correlation": correlation_data,
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,
        "ai_insights": ai_response.text,
        "chart_data": chart_data,
        "preview": preview_data
    }

@app.get("/gemini-test")
def genai_test():

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Hello! How you doing my Mate."
    )

    return {
        "response": response.text
    }

@app.post("/ask")
def ask_questions(request: QuestionRequest):

    global dataset_context

    if not dataset_context:
        return {
            "error": "Please upload a CSV file first."
        }

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"""
You are an expert data analyst.

You have access to the following dataset analysis:

{dataset_context}

Answer the user's question based ONLY on
the dataset information provided above.

If the required information is not available,
clearly say that the information is not available.

Do not invent or assume values.

Keep the answer simple, clear and practical.

User Question:
{request.question}
"""
    )

    return {
        "question": request.question,
        "response": response.text
    }