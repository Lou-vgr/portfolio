# Portfolio

Personal portfolio built with **Astro**, **React**, and **SCSS**, featuring dynamic collections and interactive components.

## 🚀 Features

* **Astro Framework:** Blazing fast static site generation with zero JavaScript by default.
* **Content Collections:** Structured and type-safe yaml/content management.
* **Interactive UI:** Custom React components for smooth user experiences.
* **Responsive Design:** Fully optimized layout for mobile, tablet, and desktop viewports.
* **Modern Styling:** SCSS styling with glassmorphism effects and custom animations.

## 🛠️ Tech Stack

* **Core:** [Astro](https://astro.build/)
* **UI Components:** [React](https://react.dev/)
* **Styles:** SCSS
* **Icons / Fonts:** Inter & Orbitron

## 📦 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have **Node.js** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Lou-vgr/portfolio.git
   ````

2. Navigate to the project directory:
    ```bash
    cd portfolio
    ```

3. Install the dependencies:
    ```bash
    npm install    
    ```

#### Development Server
Start the local development server:

```bash
npm run dev
```

The site will be available at http://localhost:4321.

#### Build for Production

To build the project for production into the ./dist/ folder:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
├── 📂 public/               # Static assets
├── 📂 src/
│   ├── 📂 components/       # Astro & React components
│   ├── 📂 content/          # Content collections
│   ├── 📂 layouts/          # Page layouts
│   ├── 📂 pages/            # Main views/pages
│   └── 📂 styles/           # SCSS stylesheets
├── 📄 astro.config.mjs      # Astro configuration
└── 📄 package.json          # Dependencies and scripts