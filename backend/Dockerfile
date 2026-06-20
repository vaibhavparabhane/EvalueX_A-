FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for libraries (like pdfplumber or similar if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the application
CMD ["python", "run.py"]
