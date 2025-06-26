## 📄 Project Overview

This is a **responsive frontend project** built during my **Frontend React Internship at Web Masters**. It simulates a **Medical Center Website** where users can:

- 📅 Book appointments using a validated form  
- 🩺 View available medical services and departments  
- 📋 Interact with a public list of appointments (with edit/delete functionality)

The project structure was inspired by real-world healthcare websites, and the dashboard functionality was built from scratch as a **challenging task** to practice managing dynamic data.

### 🔧 Key Highlights:

- Modular React architecture with Vite  
- Public-facing site (no login required)  
- Simple **dashboard interface** for appointment management  
- **Pagination system** to organize and browse multiple appointments  
- **Email verification modal** before edit/delete (no full auth)

This project allowed me to apply key frontend skills such as responsive layout design, form validation, state management, and API interaction using a mock backend.


## 📦 Tech Stack

- **Framework**: React.js + Vite
- **Styling**: Tailwind CSS + Flowbite React
- **Routing**: React Router DOM
- **Form Handling**: Formik + Yup
- **API Integration**: Axios
- **UI Tools**: FontAwesome, React Slick, React Toastify
- **Backend API**: [JSON Server](https://json-server-api-production-9295.up.railway.app/) (hosted on Railway)

---

## ✨ Features

- View medical departments & services
- Book an appointment (validated form)
- View public list of appointments
- Edit/Delete appointments with email verification (modal prompt)
- Responsive and user-friendly interface
- Clean separation of UI: Website (Header, Hero, Footer) and Dashboard (Sidebar, Appointments View)
- Pagination system to efficiently manage long appointment lists

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/FatmaMoataz/MedicalCenter-Website.git
cd MedicalCenter-Website
```
### 2. Install depencendies

```bash
npm install
```
### 3. Run the development server

```bash
npm run dev
```

This project uses a mock backend built with JSON Server.


⚠️ Note: The API is hosted on a free Railway plan. If no data appears, it may require re-deployment.

