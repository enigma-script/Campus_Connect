# 🎓 CampusConnect Events

A full-stack College Event Management System built as a mini project for Web Application Development. This application allows students to browse and register for events, while admins can manage events using full CRUD operations.

---

## 🚀 Features

### 👨‍🎓 Student Features

* Browse upcoming events
* View detailed event information
* Register / Unregister for events
* View personal registrations

### 👨‍💼 Admin Features

* Add new events (Create)
* View all events (Read)
* Edit event details (Update)
* Delete events (Delete)
* View number of registrations per event

---

## 🔄 CRUD Operations

This application fully implements CRUD:

* **Create** → Admin adds new events
* **Read** → Users view event listings and details
* **Update** → Admin edits event details/status
* **Delete** → Admin removes events

---

## 🛠️ Tech Stack

### Frontend

* React (Vite + TypeScript)
* Tailwind CSS
* shadcn/ui components

### Backend & Database

* Supabase (PostgreSQL)
* Supabase Auth (Authentication)
* Supabase Storage (Image uploads)

---

## 🔐 Authentication & Roles

* Users can sign up and log in using email/password
* Role-based access:

  * **Student** → View & register for events
  * **Admin** → Full event management access
* Roles are managed using a `profiles` table in Supabase

---

## 🗄️ Database Design

### Tables:

### `events`
- id, title, date, time, venue
- category, description
- poster_url, status, created_at

### `registrations`
- id, event_id, user_id, registered_at

### `profiles`
- id, role (student/admin)
  
Relationships:

* One user can register for many events
* Each registration links a user and an event

---

## 📦 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/enigma-script/Campus_Connect.git
cd Campus_Connect
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root folder:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the app:

```bash
npm run dev
```

5. Open in browser:

```
http://localhost:5173
```

---

## 🌐 Live Demo

> [(Campus Connect)](https://campus-connect-v5hd.vercel.app/)]

---

## 🧪 Demo Accounts

**Admin**

* Email: [your-email@example.com](mailto:your-email@example.com)
* Password: ******

**Student**

* Create a new account via signup

---

## 🧠 Learning Outcomes

* Built a full-stack web application
* Implemented CRUD operations with a database
* Integrated authentication and role-based access
* Worked with real-world deployment tools

---

## 📌 Future Improvements

* Dark mode support
* Email notifications for event registration
* Export registrations to CSV
* Advanced filtering & search
## 📌 Key Concepts Demonstrated

* CRUD Operations
* Authentication & Authorization
* Role-Based Access Control
* RESTful Data Handling
* Responsive UI Design

---

## 🌍 Deployment

The application is deployed using Vercel.

---

## 👩‍💻 Author

**Khadeejah Shaikh** & **Sharyu Kasbe**
Third Year IT Students

---

## 📄 License

This project is for educational purposes.

