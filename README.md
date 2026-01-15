# CRUD-project

Prosta aplikacja e-commerce umożliwiająca przeglądanie produktów, zarządzanie koszykiem, składanie zamówień oraz dodawanie recenzji. Projekt jest w pełni skonteneryzowany.

## Technologie

-   **Frontend:** React, Vite, TypeScript, TailwindCSS, Axios
-   **Backend:** Node.js, Express, TypeScript, Sequelize ORM
-   **Baza danych:** PostgreSQL
-   **Infrastruktura:** Docker, Docker Compose

## Setup i Uruchomienie

1.  **Utwórz plik `.env`** w głównym katalogu projektu i wklej poniższą konfigurację:

    ```env
    # DB VARIABLES
    DB_USER=admin
    DB_PASSWORD=password
    DB_NAME=app

    # FRONTEND VARIABLES
    VITE_APP_PORT=3001

    # BACKEND VARIABLES
    JWT_SECRET=tajne
    APP_PORT=3001
    ```

2.  **Uruchom aplikację** za pomocą Docker Compose:

    ```bash
    docker-compose up -d --build
    ```

3.  **Dostęp do aplikacji:**
    -   Frontend: [http://localhost:5173](http://localhost:5173)
    -   Backend API: [http://localhost:3001](http://localhost:3001)

## Zatrzymywanie

Aby zatrzymać kontenery i posprzątać środowisko:

```bash
docker-compose down
```
