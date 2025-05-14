# WebXAll

## 🛠️ Installation & Setup

### Prerequisites

Before getting started, make sure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (version **18.0.0** or higher recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)

---

### Clone the Repository

```bash
git clone https://github.com/PAJEAN/WebXAII.git
cd WebXAII
```

### Install Dependencies

Once inside the project folder, run the following command to install all dependencies:

```bash
npm install
```

---

### 🚀 Start the Development Environment (Frontend Only)

To start the frontend development server with hot-reloading (handled by Webpack), run:

```bash
npm run dev-front
```

During development, the frontend uses mock data provided in [`src/utils/test_data.js`](src/utils/test_data.js).

> **Note:** This file simulates API responses and is useful when the backend is not running.

---

### 🖥️ Optional: Start the Backend Server

If you want to test the application with a real backend, you can start the backend server with:

```bash
npm run dev-back
# Or with nodemon: ./node_modules/nodemon/bin/nodemon.js functions/index.js
```

Make sure the `MAIN_URL` variable in [`src/utils/test_data.js`](src/utils/test_data.js) points to the correct backend address (e.g., `http://localhost:3000`) so that API calls are routed properly.

---

### 📦 Build for Production

To generate the production build of the project, run:

```bash
npm run build
```

This command uses Webpack to bundle and optimize the frontend application. The output will be placed in the [`dist`](./dist) folder.

You can then serve the contents of the `dist` folder using any static file server.

---

## 🧩 Customizing User Data

To use your own data with the application, you need to modify the content of the `data/` directory located in the backend.

The structure is as follows:

```
functions/
└── data/
    ├── protocols/
    │   └── p1-test.json          # Protocol file linked to a user
    ├── user-data/
    └── users.json                # User configuration file
```

### 👤 Defining Users

All users are defined in the [`users.json`](functions/data/users.json) file.

Example:

```json
{
    "test": {
        "roles": "user",
        "protocol": "p1-test.json"
    }
}
```

* `"test"` is the **user ID**.
* `"roles"` defines the role (currently unused but reserved for permission levels).
* `"protocol"` refers to a file in the `protocols/` folder, which describes the expected protocol for that user.

### 📁 Adding New Users

To add a new user:

1. Add a new entry in `users.json`:

   ```json
   {
       "newUserId": {
           "roles": "user",
           "protocol": "p2-example.json"
       }
   }
   ```
2. Link the associated protocol file in `protocols/`, e.g., `protocols/p2-example.json`.

🔁 Sharing Protocols Between Users

You can assign the same protocol file to multiple users.

Example:

```
{
    "user1": { "roles": "user", "protocol": "p1-common.json" },
    "user2": { "roles": "user", "protocol": "p1-common.json" },
    "user3": { "roles": "user", "protocol": "p1-common.json" }
}
```

> ⚠️ Make sure that each protocol filename in `users.json` matches an actual file in the `protocols/` folder.