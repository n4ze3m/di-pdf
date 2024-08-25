# DiPDF
## Overview

DiPDF is an AI-powered tool for efficient PDF generation, leveraging the IBM WatsonX Granite model. This repository includes a Docker setup for easy deployment.

## Prerequisites

- Docker
- IBM Wastonx API Key

## Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/n4ze3m/di-pdf.git
cd dipdf
```

### Step 2: Create a `.env` File

Create a `.env` file in the root of the project with the following environment variables:

```env
# .env

POSTGRES_URL=your_postgres_connection_url
IBM_API_KEY=
IBM_PROJECT_ID=
IBM_MODEL_ID=
```

Replace with your actual values.

### Step 3: Build the Docker Image

```bash
docker build -t dipdf-image .
```

This command builds the Docker image with the tag `dipdf-image`.

### Step 4: Run the Docker Container

```bash
docker run --env-file .env -p 8080:8080 dipdf-image
```

This command runs the container, passing in the `.env` file and mapping port `8080` (or your preferred port) to the container.

### Step 5: Access the Application

Once the container is running, you can access the application at `http://localhost:8080`.

## Contributing

Contributions are welcome! Please fork this repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.
