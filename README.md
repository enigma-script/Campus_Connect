# 🎓 CampusConnect Events

A full-stack College Event Management System built as a mini project for Web Application Development. This application allows students to browse and register for events, while admins can manage events using full CRUD operations.

---

## 🚀 Features

### 👩‍🎓 Student

* Browse all events
* View event details
* Register / Unregister for events
* View registered events

### 👨‍💼 Admin

* Add new events (Create)
* View all events (Read)
* Edit event details (Update)
* Delete events (Delete)
* View number of registrations

---

## 🔐 Authentication & Roles

* User authentication implemented using Supabase Auth
* Each user has a role stored in a `profiles` table:

  * `student` (default)
  * `admin` (manually assigned)
* Role-based access control ensures only admins can manage events

---

## 🗄️ Database Design

### Tables:

* **events**
* **registrations**
* **profiles**

Relationships:

* One user can register for many events
* Each registration links a user and an event

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite + TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
* **Deployment:** Vercel

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

> (Add your Vercel link here after deployment)

---

## 🧪 Demo Accounts

**Admin**

* Email: [your-email@example.com](mailto:your-email@example.com)
* Password: ******

**Student**

* Create a new account via signup

---

## 📌 Key Concepts Demonstrated

* CRUD Operations
* Authentication & Authorization
* Role-Based Access Control
* RESTful Data Handling
* Responsive UI Design

---

## 👩‍💻 Author

**Khadeejah Shaikh**
Third Year IT Student

---

## 📜 License

This project is for educational purposes.

