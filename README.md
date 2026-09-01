# AI-Powered Data Analyst

An AI-powered data analysis web application that allows users to upload a CSV dataset, automatically analyze the data, visualize important information, and ask questions about the dataset using Google Gemini.

## Features

* CSV file upload
* Automatic dataset analysis
* Row and column count
* Column name detection
* Missing value detection
* Duplicate row detection
* Data type detection
* Numerical and categorical column identification
* Statistical summary
* Correlation analysis
* Dataset preview
* Automatic chart data generation
* AI-generated dataset insights
* AI-powered question answering
* Responsive web interface
* FastAPI backend
* Gemini AI integration

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Responsive UI

### Backend

* Python
* FastAPI
* Pandas
* Pydantic
* Uvicorn

### AI

* Google Gemini API
* Google GenAI SDK

### Environment

* Python Virtual Environment
* `.env` for API key management

## Project Structure

```text
AI-Powered-Data-Analyst/
│
├── backend/
│   ├── main.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

## How It Works

The application follows this workflow:

```text
User uploads CSV
       ↓
FastAPI receives file
       ↓
Pandas loads dataset
       ↓
Data analysis
       ↓
Missing values
Duplicates
Statistics
Data types
Correlation
       ↓
Dataset preview + chart data
       ↓
Gemini analyzes dataset
       ↓
AI insights displayed
       ↓
User asks questions
       ↓
FastAPI sends dataset context + question
       ↓
Gemini generates answer
```

## Backend Setup

Open the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn pandas python-multipart python-dotenv google-genai
```

## Environment Variables

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Do not upload your `.env` file to GitHub.

## Run Backend

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

## API Endpoints

### Home

```text
GET /
```

Checks whether the backend is running.

### Test

```text
GET /test
```

Basic FastAPI test endpoint.

### Upload Dataset

```text
POST /upload
```

Accepts a CSV file and returns:

* Dataset information
* Statistics
* Missing values
* Duplicate rows
* Correlation
* Chart data
* Dataset preview
* AI-generated insights

### Gemini Test

```text
GET /gemini-test
```

Tests the Gemini API connection.

### Ask Question

```text
POST /ask
```

Accepts:

```json
{
  "question": "What is the average salary?"
}
```

Returns an AI-generated answer based on the uploaded dataset context.

## Example Questions

After uploading a dataset, users can ask questions such as:

```text
What is the average salary?
```

```text
What is the highest sales value?
```

```text
How many rows are in the dataset?
```

```text
Which columns contain missing values?
```

```text
What are the important insights from this dataset?
```

```text
What is the relationship between sales and profit?
```

## Frontend Setup

Open the frontend folder and run the application using a local server.

For example, using VS Code Live Server:

```text
index.html → Open with Live Server
```

The frontend communicates with the FastAPI backend using JavaScript `fetch()` requests.

The backend URL is:

```text
http://127.0.0.1:8000
```

## CORS

The backend uses FastAPI's CORS middleware so that the frontend and backend can communicate when they are running on different ports.

## Important Notes

The current application stores the uploaded dataset in memory:

```python
dataset_df = df
```

This means the uploaded dataset is available while the backend process is running.

Restarting the FastAPI server clears the uploaded dataset.

For a production application, this can later be improved using:

* Database storage
* Session-based dataset management
* Temporary file storage
* User authentication
* Cloud storage

## Future Improvements

Planned improvements include:

* RAG-based dataset question answering
* Better natural-language query understanding
* Automatic chart generation
* More advanced data visualizations
* Data cleaning suggestions
* Outlier detection
* Feature relationship analysis
* AI-generated reports
* Excel support
* Multiple dataset support
* User authentication
* Database integration
* Conversation history
* Downloadable analysis reports
* Deployment using cloud services

## RAG Integration

A future version can use RAG to improve question answering.

The architecture can become:

```text
CSV Dataset
    ↓
Data Processing
    ↓
Dataset Documents / Metadata
    ↓
Embeddings
    ↓
Vector Database
    ↓
Retriever
    ↓
Relevant Dataset Context
    ↓
Gemini
    ↓
Final Answer
```

This will make the AI better at retrieving relevant information from large datasets instead of sending the complete dataset context for every question.

## Security

Never expose your Gemini API key in frontend JavaScript.

Use:

```env
GEMINI_API_KEY=your_api_key
```

and access it from the backend.

Also add `.env` to `.gitignore`:

```text
.env
.venv/
__pycache__/
*.pyc
```

## Project Goal

The goal of this project is to build an interactive AI-powered data analyst that allows users to upload their datasets and interact with them using natural language instead of manually writing Python or SQL queries.

## Author

Honey Verma

B.Tech Artificial Intelligence

## License

This project is created for educational and portfolio purposes.
