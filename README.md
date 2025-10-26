# 🌍 HNG Stage 2 Backend — Country Currency & Exchange API

## 🧠 Overview
This RESTful API fetches global country data and exchange rates, computes estimated GDPs, caches the data in a MySQL database, and exposes CRUD and analytics endpoints.

Built with **Node.js + Express + Sequelize + MySQL**, this project fulfills all HNG Stage-2 backend requirements.

---

## ⚙️ Tech Stack
- **Node.js (Express)** — Web server
- **Sequelize ORM** — MySQL integration
- **Axios** — External API requests
- **Canvas** — Image generation
- **MySQL** — Persistent data storage
- **dotenv** — Environment variable management

---

## Features
-   **Dynamic Data Refresh**: Automatically fetches and updates country data and exchange rates from external REST APIs.
-   **Comprehensive Country Data**: Stores and provides details such as country name, capital, region, population, currency code, exchange rate, estimated GDP, and flag URL.
-   **Filtering & Sorting**: Enables querying countries by region, currency, and sorting by estimated GDP (ascending/descending).
-   **Data Status Monitoring**: Provides an endpoint to check the total number of countries stored and the timestamp of the last data refresh.
-   **Image Generation**: Dynamically creates a summary image visualizing key data points.
-   **RESTful API**: Exposes a clean and well-structured API for seamless integration with frontend applications.
-   **Robust ORM**: Leverages Sequelize for efficient and secure interaction with a MySQL database.
-   **Global Error Handling**: Centralized error management to provide consistent and informative error responses.

## Technologies Used
| Technology       | Description                                        | Link                                                               |
| :--------------- | :------------------------------------------------- | :----------------------------------------------------------------- |
| **Node.js**      | JavaScript runtime environment                     | [Node.js](https://nodejs.org/en/)                                  |
| **Express.js**   | Web application framework for Node.js              | [Express.js](https://expressjs.com/)                               |
| **Sequelize**    | Promise-based Node.js ORM for Postgres, MySQL, etc | [Sequelize](https://sequelize.org/)                                |
| **MySQL**        | Relational database management system              | [MySQL](https://www.mysql.com/)                                    |
| **`dotenv`**     | Loads environment variables from a `.env` file     | [dotenv](https://www.npmjs.com/package/dotenv)                     |
| **`axios`**      | Promise-based HTTP client                          | [axios](https://www.npmjs.com/package/axios)                       |
| **`canvas`**     | Node.js canvas implementation for image generation | [canvas](https://www.npmjs.com/package/canvas)                     |
| **`cors`**       | Node.js middleware for Cross-Origin Resource Sharing | [cors](https://www.npmjs.com/package/cors)                         |
| **`morgan`**     | HTTP request logger middleware                     | [morgan](https://www.npmjs.com/package/morgan)                     |
| **`nodemon`**    | Utility that automatically restarts the Node.js server | [nodemon](https://www.npmjs.com/package/nodemon)                   |
| **`prettier`**   | Code formatter                                     | [Prettier](https://prettier.io/)                                   |

## Getting Started

### Installation
To get this project up and running locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/PaulsCreate/HNG13_Stage-2.git
    cd HNG13_Stage-2
    ```

2.  **Install Dependencies**:
    Install all required Node.js packages:
    ```bash
    npm install
    ```

3.  **Database Setup**:
    Ensure you have a MySQL server running and create a database for the project.

4.  **Environment Variables**:
    Create a file named `src/conf.env` in the `src` directory and populate it with your database credentials and server port.

5.  **Run the Server**:
    Start the development server with `nodemon` for automatic restarts on code changes:
    ```bash
    npm run dev
    ```
    Alternatively, for a production environment:
    ```bash
    npm start
    ```
    The server will start on the port specified in your `src/conf.env` file.

### Environment Variables
All required environment variables must be defined in `src/conf.env`:

-   `PORT`: The port on which the Express server will run.
    -   Example: `PORT=3000`
-   `DB_NAME`: Your MySQL database name.
    -   Example: `DB_NAME=hng13_country_db`
-   `DB_USER`: Your MySQL database username.
    -   Example: `DB_USER=root`
-   `DB_PASSWORD`: Your MySQL database password.
    -   Example: `DB_PASSWORD=your_db_password`
-   `DB_HOST`: Your MySQL database host.
    -   Example: `DB_HOST=localhost`
-   `DB_DIALECT`: The database dialect. For this project, it is `mysql`.
    -   Example: `DB_DIALECT=mysql`

## API Documentation

### Base URL
The base URL for all API endpoints is `http://localhost:[PORT]`. For example, if `PORT` is 3000, the base URL is `http://localhost:3000`.

### Endpoints

#### GET /
**Overview**: A simple health check endpoint to confirm the server is operational.

**Response**:
```
Hello, World!
```

#### GET /test
**Overview**: A simple test endpoint to confirm basic route functionality.

**Response**:
```json
{
  "message": "Tested Successful"
}
```

#### POST /country/refresh
**Overview**: Initiates a comprehensive data refresh. This endpoint fetches country information from `restcountries.com` and currency exchange rates from `open.er-api.com`, then updates or inserts the data into the database. A summary image is generated asynchronously after the database update.

**Request**:
This endpoint does not require a request payload.

**Response**:
```json
{
  "message": "✅ Countries refreshed successfully",
  "total": 250,
  "last_refreshed_at": "2024-07-20T10:00:00.000Z"
}
```

**Errors**:
-   `503 Service Unavailable`: Occurs if the external data sources (country or exchange rate APIs) are unreachable or return an error.

#### GET /country
**Overview**: Retrieves a list of countries from the database. This endpoint supports filtering by region and currency code, and sorting by estimated GDP.

**Request**:
Query parameters can be used to filter and sort the results:
-   `region`: (Optional) Filter countries by their region (e.g., `?region=Africa`).
-   `currency`: (Optional) Filter countries by their ISO currency code (e.g., `?currency=USD`).
-   `sort`: (Optional) Sort the results.
    -   `gdp_desc`: Sort by `estimated_gdp` in descending order.
    -   `gdp_asc`: Sort by `estimated_gdp` in ascending order.

Example: `GET /country?region=Europe&sort=gdp_desc`

**Response**:
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139587,
    "currency_code": "NGN",
    "exchange_rate": 750.0,
    "estimated_gdp": 5000000000000,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2024-07-20T10:00:00.000Z",
    "createdAt": "2024-07-20T10:00:00.000Z",
    "updatedAt": "2024-07-20T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Ghana",
    "capital": "Accra",
    "region": "Africa",
    "population": 31072945,
    "currency_code": "GHS",
    "exchange_rate": 12.0,
    "estimated_gdp": 100000000000,
    "flag_url": "https://flagcdn.com/gh.svg",
    "last_refreshed_at": "2024-07-20T10:00:00.000Z",
    "createdAt": "2024-07-20T10:00:00.000Z",
    "updatedAt": "2024-07-20T10:00:00.000Z"
  }
]
```

**Errors**:
-   `500 Internal server error`: An unexpected error occurred on the server.

#### GET /country/status
**Overview**: Provides a summary of the stored country data, including the total number of countries and the timestamp of the most recent data refresh.

**Request**:
This endpoint does not require a request payload.

**Response**:
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2024-07-20T10:00:00.000Z"
}
```

#### GET /country/image
**Overview**: Serves the dynamically generated summary image (e.g., `summary.png`) which visualizes the overall country data status.

**Request**:
This endpoint does not require a request payload.

**Response**:


<img width="804" height="555" alt="Screenshot 2025-10-26 205913" src="https://github.com/user-attachments/assets/164955db-8e92-41f9-bf1a-a273802f858e" />


**Errors**:
-   `404 Not Found`: The summary image has not been generated yet or could not be found.

#### GET /country/:name
**Overview**: Retrieves detailed information for a single country specified by its name.

**Request**:
Path Parameter:
-   `name`: The exact name of the country (e.g., `Nigeria`).

Example: `GET /country/Nigeria`

**Response**:
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139587,
  "currency_code": "NGN",
  "exchange_rate": 750.0,
  "estimated_gdp": 5000000000000,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2024-07-20T10:00:00.000Z",
  "createdAt": "2024-07-20T10:00:00.000Z",
  "updatedAt": "2024-07-20T10:00:00.000Z"
}
```

**Errors**:
-   `404 Not Found`: No country with the specified name was found in the database.

#### DELETE /country/:name
**Overview**: Deletes a country record from the database based on its name.

**Request**:
Path Parameter:
-   `name`: The exact name of the country to be deleted (e.g., `Nigeria`).

Example: `DELETE /country/Nigeria`

**Response**:
```json
{
  "message": "Country deleted"
}
```

**Errors**:
-   `404 Not Found`: No country with the specified name was found to be deleted.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author Info

Connect with the author of this project:

-   **Paul Yusuf**
    -   LinkedIn: [YourLinkedInUsername](https://linkedin.com/in/yourlinkedinusername)
    -   Twitter: [@YourTwitterHandle](https://twitter.com/YourTwitterHandle)

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
