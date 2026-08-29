# Radha Rani Handicrafts

A modern, responsive e-commerce platform built for Radha Rani Handicrafts, a real handicraft business specializing in handmade idols, home décor, and traditional Indian crafts.

🌐 **Live Website:** [radharanihandicrafts.com](https://radharanihandicrafts.com/)

---

## Overview

Radha Rani Handicrafts is a production-deployed e-commerce website designed to showcase authentic handcrafted products online. The platform provides a seamless browsing experience with dynamic product listings, category-based navigation, responsive layouts, and headless CMS content management.

---

## Features

- **Dynamic Product Listings & Routing:** Seamless navigation for categories and detailed product pages.
- **Headless CMS Integration:** Powered by Sanity CMS for decoupled content and image management.
- **Responsive Design:** Fully optimized layout across mobile, tablet, and desktop screens.
- **Modern UI Architecture:** Built with reusable React components and styled via Tailwind CSS.
- **SEO & Performance:** SEO-friendly HTML structure with Next.js image and page optimization.
- **Production-Ready Deployment:** Hosted on Vercel with automated CI/CD workflows.

---

## Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | Next.js |
| **Frontend** | React, JavaScript |
| **Styling** | Tailwind CSS |
| **CMS** | Sanity CMS |
| **Deployment** | Vercel |

---

## Architecture

The application uses Next.js for routing, rendering, and performance optimization, coupled with Sanity CMS for client-managed product catalogs.

```text
Product Content (Sanity CMS) ──> Next.js Engine ──> Reusable React UI ──> Vercel Edge Network
```
## Project Structure

```text
RadhaRaniHandicraft/
├── app/                  # Next.js App Router pages and API routes
├── components/           # Reusable React UI components
├── lib/                  # Helper utilities and Sanity client configurations
├── public/               # Static assets (favicons, icons)
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```
Getting Started

Navigate to the project directory:

```Bash
cd RadhaRaniHandicraft
```
Install dependencies:

```Bash
npm install
```
Set up local environment variables:

```Bash
cp .env.example .env.local
```
# Update .env.local with your Sanity credentials
Run the development server:

```Bash
npm run dev
```
Open http://localhost:3000 in your browser.

Production Build

To test a production build locally:

```Bash
npm run build
npm start
```

## Screenshots

Homepage <img width="1895" height="940" alt="Radha Rani Handicrafts homepage" src="https://github.com/user-attachments/assets/e86bff27-cc7e-4c28-99ef-125ea98ca05d" />

Product Catalog <img width="1895" height="937" alt="Radha Rani Handicrafts product page" src="https://github.com/user-attachments/assets/759dea23-ebfa-46fd-9890-005a3745e4dc" />

Product Detail Page <img width="1899" height="947" alt="image" src="https://github.com/user-attachments/assets/2782d768-a8e5-4891-8df0-a4b4f9c85c31" />


## What I Built

Through this project, I worked on:

- **Building** a real-world e-commerce interface
- **Creating** responsive layouts for multiple screen sizes
- **Implementing** dynamic product and category pages
- **Integrating** Sanity CMS
- **Managing** product and image content
- **Building** reusable React components
- **Implementing** SEO-friendly page structures
- **Configuring** production deployment
- **Connecting** a frontend application to external content services

## Challenges

Some of the main development challenges included:

- **Structuring** reusable components for different product and content sections
- **Connecting** the Next.js application with Sanity CMS
- **Handling** dynamic product and category routes
- **Creating** responsive layouts that work across different screen sizes
- **Managing** production environment configuration
- **Organizing** product content so that it can be maintained without changing frontend code

---

## Future Improvements

Possible future improvements include:

- [ ] Shopping cart functionality
- [ ] Online checkout
- [ ] Customer accounts
- [ ] Order management
- [ ] Product search and advanced filtering
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin-specific workflows
- [ ] Additional analytics and reporting

---

## Project Status

🟢 **Live and deployed**

The project is currently available at: 
🌐 [radharanihandicrafts.com](https://radharanihandicrafts.com)

---

## Author

**Shreshtha Agarwal**  
*Frontend Developer focused on React and Next.js.*

- **Portfolio:** [shreshtha.vercel.app](https://shreshtha.vercel.app)
- **GitHub:** [github.com/afkshreshtha](https://github.com/afkshreshtha)
- **LinkedIn:** [linkedin.com/in/shreshtha-agarwal-211a65279](https://www.linkedin.com/in/shreshtha-agarwal-211a65279)

---

## Usage

This repository is publicly available for portfolio and educational purposes. 

> **Note:** The business name, branding, product images, content, and other business-specific assets belong to their respective owners and should not be reused without permission.
