# Unleashed - E-commerce Fashion Platform

[![Project Status](https://img.shields.io/badge/Status-Development-yellow)](https://shields.io/)
[![Backend](https://img.shields.io/badge/Backend-Java%20Spring%20Boot-brightgreen)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-ReactJS-blue)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-orange)](https://www.postgresql.org/)

## Table of Contents

1.  [Project Description](#project-description)
2.  [Project Structure](#project-structure)
3.  [Technologies Used](#technologies-used)
4.  [Setup Instructions](#setup-instructions)
    *   [Prerequisites](#prerequisites)
    *   [Backend Setup](#backend-setup)
    *   [Frontend Setup](#frontend-setup)
    *   [Accessing the Application](#accessing-the-application)
5.  [Environment Variables](#environment-variables)
    *   [Backend Environment Variables](#backend-environment-variables)
    *   [Frontend Environment Variables](#frontend-environment-variables)
6.  [Deployment](#deployment)
7.  [Future Plans](#future-plans)
8.  [Contact](#contact)
9.  [Acknowledgements](#acknowledgements)

---

## 1. Project Description <a name="project-description"></a>

**Unleashed** is a cutting-edge, full-stack e-commerce platform meticulously crafted to deliver a **seamless and engaging online fashion shopping experience**. Designed with both customers and administrators in mind, Unleashed provides a robust and user-friendly environment for browsing, purchasing, and managing fashion products online.

**Key Features:**

*   **Intuitive User Interface:** A clean and modern frontend built with ReactJS, ensuring a smooth and responsive shopping journey for customers across all devices.
*   **Comprehensive Product Catalog:**  Showcase a wide range of fashion items with detailed product listings, including multiple variations (size, color, etc.), high-quality images, and customer reviews.
*   **Secure User Accounts:**  Robust user authentication and authorization system, including secure password management and options for social logins (like Google).
*   **Shopping Cart and Checkout:**  A streamlined shopping cart and checkout process with integrated payment gateways (PayOS and VNPay for now, with potential for expansion).
*   **Order Management:**  Comprehensive order tracking and management for both customers and administrators.
*   **Admin Dashboard:**  A powerful backend admin panel built with Spring Boot, allowing administrators to efficiently manage products, categories, brands, discounts, user accounts, orders, and sales statistics.
*   **Inventory Management:**  Detailed stock management system to track product availability and variations.
*   **Reporting and Analytics:**  Gain insights into sales trends, best-selling products, and customer behavior with built-in reporting and analytics features.
*   **Notification System:**  Keep users informed with real-time notifications for order updates, promotions, and account activities.

Unleashed aims to be more than just an online store; it's envisioned as a dynamic platform that empowers fashion businesses to thrive in the digital marketplace and provides customers with an enjoyable and efficient shopping experience.

## 2. Project Structure <a name="project-structure"></a>

The project is structured as a full-stack application with separate directories for the backend and frontend:

```
unleashed/
├── backend/             # Backend - Java Spring Boot application
│   ├── .mvn/
│   ├── src/
│   │   ├── main/java/com/unleashed/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repo/
│   │   │   ├── rest/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── main/resources/
│   │       ├── application.properties # Backend configuration
│   │       └── templates/          # Backend templates (if any)
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml             # Maven project file
├── frontend/            # Frontend - ReactJS application
│   ├── .vscode/
│   ├── node_modules/
│   ├── public/
│   │   └── ...          # Static assets (images, etc.)
│   ├── src/
│   │   ├── assets/      # Frontend assets (images, animations)
│   │   ├── components/  # React components
│   │   ├── core/        # Core frontend logic
│   │   ├── layouts/     # Page layouts
│   │   ├── MockData/    # Mock data for development
│   │   ├── pages/       # React pages/views
│   │   ├── routes/      # Frontend routing configuration
│   │   └── service/     # Frontend services (API calls)
│   ├── package.json     # Frontend dependencies and scripts
│   ├── yarn.lock        # Frontend dependency lock file (or npm lock file)
│   └── ...              # Other frontend configuration files
├── databaseUnleashed.sql # PostgreSQL database script
└── README.md             # Project README (this file)

```

*   **`backend/`**: Contains the Java Spring Boot backend application, including controllers, services, data models (entities, DTOs), repositories, configurations, and security setup.
*   **`frontend/`**: Contains the ReactJS frontend application, structured with components, pages, services, and assets.
*   **`databaseUnleashed.sql`**: SQL script to set up the PostgreSQL database and populate it with initial data.

## 3. Technologies Used <a name="technologies-used"></a>

*   **Backend:**
    *   **Language:** Java (OpenJDK)
    *   **Framework:** [Spring Boot](https://spring.io/projects/spring-boot)
    *   **Database:** [PostgreSQL](https://www.postgresql.org/)
    *   **Build Tool:** [Maven](https://maven.apache.org/)
    *   **IDE (Recommended):** [IntelliJ IDEA](https://www.jetbrains.com/idea/) (for optimal Java/Spring Boot development experience)

*   **Frontend:**
    *   **Framework:** [ReactJS](https://reactjs.org/)
    *   **UI Library:** [Material-UI (MUI)](https://mui.com/) (within `node_modules`, used by frontend components)
    *   **Package Manager:** [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (see `package.json` and lock file)

## 4. Setup Instructions <a name="setup-instructions"></a>

Follow these steps to get the Unleashed project up and running on your local machine.

### Prerequisites <a name="prerequisites"></a>

Before you begin, ensure you have the following software installed:

1.  **Java Development Kit (JDK):** [OpenJDK](https://openjdk.java.net/) or [Oracle JDK](https://www.oracle.com/java/technologies/javase-downloads.html). Ensure you have **Java 17 or higher** installed.
2.  **Node.js and npm (or yarn):** [Node.js](https://nodejs.org/).  This is required for running the frontend React application. npm comes bundled with Node.js.
3.  **PostgreSQL:** [PostgreSQL Downloads](https://www.postgresql.org/download/). Install and ensure PostgreSQL server is running.
4.  **IntelliJ IDEA (Recommended):** [IntelliJ IDEA](https://www.jetbrains.com/idea/) (Community or Ultimate edition). While not strictly required, it's highly recommended for backend Java development and provides excellent Spring Boot support.
5.  **Maven:** [Apache Maven](https://maven.apache.org/download.cgi). If you are using IntelliJ IDEA, Maven is usually bundled, but ensure it's configured correctly.

### Backend Setup <a name="backend-setup"></a>

1.  **Clone the Repository:**
    ```bash
    git clone <your-gitlab-repository-url> unleashed
    cd unleashed/backend
    ```

2.  **Database Setup:**
    *   **Install PostgreSQL** if you haven't already.
    *   **Open your PostgreSQL client** (like pgAdmin, DBeaver, or command-line `psql`).
    *   **Run the `databaseUnleashed.sql` script** located in the root directory of the project (`unleashed/databaseUnleashed.sql`). This script will create the database named `Unleashed` and populate it with sample data.
    *   **Default Admin Account:** After running the script, an administrator account will be created with the following credentials:
        *   **Username:** `admin123`
        *   **Password:** `Admin123`

3.  **Configure Environment Variables:**
    *   Navigate to the `backend/src/main/resources/` directory.
    *   **Open `application.properties`**.
    *   **Modify the following properties** to match your PostgreSQL setup and PayOS API keys.  Refer to the [Environment Variables](#backend-environment-variables) section below for details.
        ```properties
        spring.datasource.url=jdbc:postgresql://localhost:5432/Unleashed  # Your PostgreSQL URL
        spring.datasource.username=postgres                        # Your PostgreSQL username
        spring.datasource.password=root                            # Your PostgreSQL password
        PAYOS_CLIENT_ID=your_payos_client_id                     # Your PayOS Client ID
        PAYOS_API_KEY=your_payos_api_key                          # Your PayOS API Key
        PAYOS_CHECKSUM_KEY=your_payos_checksum_key                # Your PayOS Checksum Key
        spring.mail.username=your_email@gmail.com                 # Your Email for SMTP
        spring.mail.password=your_email_app_password              # Your Email App Password
        ```
        **Important:** For email settings, consider using an "App Password" for Gmail if you have 2-Factor Authentication enabled.

4.  **Build and Run the Backend:**

    **Using IntelliJ IDEA (Recommended):**
    *   Open IntelliJ IDEA and import the `backend/pom.xml` file as a Maven project.
    *   Once imported, locate the `unleashedApplication.java` file in `src/main/java/com/unleashed/`.
    *   Right-click on `unleashedApplication.java` and select "Run 'unleashedApplication'".
    *   The Spring Boot backend server should start on port `8080` (or the port configured in `application.properties`).

    **Using Maven Command Line:**
    *   Navigate to the `backend/` directory in your terminal.
    *   Run the following command:
        ```bash
        mvn spring-boot:run
        ```
    *   Wait for the application to start. You should see log messages indicating that Spring Boot has started successfully.

### Frontend Setup <a name="frontend-setup"></a>

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install  # or yarn install if you use yarn
    ```

3.  **Configure Environment Variables (if needed):**
    *   In the `frontend/` directory, you might need to create a `.env` file if you have specific frontend environment variables to configure (though none are explicitly mentioned in your provided details, you might have some in your actual project).
    *   If needed, create `.env` and add frontend specific variables (e.g., API base URL if it's different from default).

4.  **Run the Frontend Application:**
    ```bash
    npm start  # or yarn start
    ```
    *   The React frontend application should start and typically open in your browser at `http://localhost:3000`.

### Accessing the Application <a name="accessing-the-application"></a>

*   **Frontend:** Access the web application in your browser at:  `http://localhost:3000`
*   **Backend API:** The backend API endpoints are available at: `http://localhost:8080/api` (or the `open.api.serverUrl` configured in `application.properties`). You can use tools like Swagger UI (if enabled in your project), Postman, or `curl` to interact with the API.

---

## 5. Environment Variables <a name="environment-variables"></a>

### Backend Environment Variables <a name="backend-environment-variables"></a>

These environment variables are configured in the `backend/src/main/resources/application.properties` file.

| Variable Name              | Description                                          | Example Value                                  |
| :------------------------- | :--------------------------------------------------- | :--------------------------------------------- |
| `spring.application.name`  | Name of the Spring Boot application.                 | `unleashed`                                    |
| `PAYOS_CLIENT_ID`          | Client ID for PayOS payment gateway integration.     | `7ed6d581-5009-4575-bc4c-0fb67295009b`          |
| `PAYOS_API_KEY`            | API Key for PayOS payment gateway integration.        | `ad215859-9e79-454d-9f5c-295576031ca3`          |
| `PAYOS_CHECKSUM_KEY`       | Checksum Key for PayOS payment gateway integration.   | `5666b4f514d7204e40ead619ec0f589781a1fc22ec8f7eafed3f02cc576500b5` |
| `spring.security.user.name` | Default security username (for basic auth, if enabled). | `a`                                            |
| `spring.security.user.password`| Default security password (for basic auth, if enabled). | `a`                                            |
| `spring.datasource.url`    | JDBC URL for connecting to the PostgreSQL database.  | `jdbc:postgresql://localhost:5432/Unleashed`   |
| `spring.datasource.username`| PostgreSQL database username.                       | `postgres`                                     |
| `spring.datasource.password`| PostgreSQL database password.                       | `root`                                         |
| `spring.data.rest.base-path`| Base path for Spring Data REST API endpoints.        | `/api`                                         |
| `spring.mail.host`         | SMTP host for email sending (e.g., password reset).  | `smtp.gmail.com`                               |
| `spring.mail.port`         | SMTP port for email sending.                         | `587`                                          |
| `spring.mail.username`     | Email address for SMTP authentication.              | `anhkhung006@gmail.com`                         |
| `spring.mail.password`     | Password for SMTP authentication (App Password recommended for Gmail). | `jxln qunp mryd cupk`                       |
| `spring.mail.properties.mail.smtp.auth` | Enable SMTP authentication.                | `true`                                         |
| `spring.mail.properties.mail.smtp.starttls.enable` | Enable STARTTLS for SMTP.     | `true`                                         |
| `spring.mvc.view.prefix`   | Prefix for MVC view resolution.                    | `/static/`                                     |
| `spring.mvc.view.suffix`   | Suffix for MVC view resolution.                    | `.html`                                        |
| `spring.mvc.pathmatch.matching-strategy`| Path matching strategy for MVC.          | `ant_path_matcher`                             |
| `open.api.title`           | Title for OpenAPI (Swagger) documentation.         | `Unleashed API`                                |
| `open.api.version`         | Version for OpenAPI (Swagger) documentation.       | `V1.0`                                         |
| `open.api.description`     | Description for OpenAPI (Swagger) documentation.   | `Reuse, reduce, recycle`                       |
| `open.api.serverUrl`       | Server URL for OpenAPI (Swagger) documentation.     | `http://localhost:8080/`                       |

**Note:**  Replace the placeholder values (e.g., `your_payos_client_id`, `your_email@gmail.com`, PostgreSQL credentials) with your actual configuration values. **Never commit sensitive information like real API keys or database passwords directly to your repository.**

### Frontend Environment Variables <a name="frontend-environment-variables"></a>

Currently, no frontend environment variables are explicitly defined in the provided information. However, if your React frontend requires environment variables (e.g., for API base URL or other configurations), you can define them in a `.env` file in the `frontend/` directory. React applications typically use environment variables prefixed with `REACT_APP_`.

Example `.env` file in `frontend/`:

```
REACT_APP_API_BASE_URL=http://localhost:8080/api
# Add other frontend environment variables here if needed
```

You would then access these variables in your React code using `process.env.REACT_APP_VARIABLE_NAME`.

## 6. Deployment <a name="deployment"></a>

Deployment instructions for Unleashed are currently under development and will be provided in a future update.  This section will be updated with details on how to deploy the application to a production environment, including suggested hosting platforms and deployment steps.

## 7. Future Plans <a name="future-plans"></a>

*   **Deployment to Production:**  Our primary future plan is to deploy the Unleashed platform to a production environment, making it accessible to users online.
*   **Uhh... I think that's it. We don't hope for much.**

## 8. Contact <a name="contact"></a>

For any questions, issues, or inquiries regarding the Unleashed project, please contact:

[unleashedworkshop.bussiness@gmail.com](mailto:unleashedworkshop.bussiness@gmail.com)

## 9. Acknowledgements <a name="acknowledgements"></a>

We would like to express our sincere gratitude to the **Belu Team** for their contributions and support in the development of Unleashed.
