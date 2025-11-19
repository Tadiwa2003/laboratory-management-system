# Linos LMS Backend

## MongoDB Setup

This project uses a **dedicated MongoDB instance** running on port **27018** to ensure complete isolation from other projects.

### Starting the MongoDB Instance

Before running the backend server, you need to start the MongoDB instance:

```bash
npm run mongodb
```

This will start MongoDB on port 27018 with data stored in `./mongodb_data`.

### Starting the Backend Server

In a separate terminal, run:

```bash
npm run dev
```

### Configuration

- **MongoDB Port:** 27018 (separate from default 27017)
- **Backend Port:** 5000
- **Database Name:** linos_lms
- **Data Directory:** `./mongodb_data`

### Important Notes

- The MongoDB instance must be running before starting the backend server
- Data is stored locally in the `mongodb_data` folder
- This instance is completely isolated from other MongoDB databases on your system
