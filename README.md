# Taekwondo Association Of Palghar District Website

A modern, responsive website for the Taekwondo Association of Palghar District built with React, TypeScript, and Node.js.

## Features

- **Modern React Frontend**: Built with TypeScript for type safety
- **Responsive Design**: Optimized for all device sizes
- **Node.js Backend**: RESTful API with Express
- **Professional Design**: Clean, martial arts-themed aesthetics
- **Component Architecture**: Modular and maintainable code structure

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

### Development

To run both frontend and backend simultaneously:

```bash
npm run dev:full
```

Or run them separately:

Frontend only:
```bash
npm run dev
```

Backend only:
```bash
npm run server
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # API utilities and helpers
│   └── App.tsx          # Main application component
├── server/
│   └── index.js         # Express server
└── package.json
```

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/events` - Fetch events
- `GET /api/gallery` - Fetch gallery images
- `POST /api/register` - User registration
- `POST /api/login` - User authentication

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, CORS
- **Icons**: Lucide React
- **Fonts**: EB Garamond (Google Fonts)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

© 2024 Taekwondo Association Of Palghar District. All rights reserved.