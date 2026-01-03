# AI Multi-Agent Support Ticket System

A full-stack application featuring an AI-powered multi-agent system for intelligent customer support ticket management. The system uses LangGraph orchestration to route tickets to specialized AI agents (Refund, Technical, General) with human admin oversight.

## 🌟 Features

- **AI-Powered Ticket Routing**: Automatic classification and routing based on ticket content
- **Multi-Agent Architecture**: Specialized AI agents for different ticket types (Refund, Technical, General)
- **Human-in-the-Loop**: Admin review and approval for low-confidence AI responses
- **Real-Time Conversations**: Thread-based messaging between customers and AI/admins
- **Smart Escalation**: Automatic escalation based on response time and agent failures
- **Admin Dashboard**: Comprehensive interface for ticket management and oversight
- **Email Notifications**: Automated notifications for ticket updates and escalations
- **Background Jobs**: Scheduled tasks for ticket escalation and timeout handling

## 🏗️ Architecture

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **AI Engine**: LangChain + LangGraph for multi-agent orchestration
- **AI Model**: OpenAI GPT integration
- **Background Jobs**: Node-cron for scheduled tasks
- **Email**: Nodemailer for SMTP email delivery
- **Logging**: Winston for structured logging

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
multi-agent-ticket-system/
├── backend/
│   ├── src/
│   │   ├── ai/                    # AI agents and orchestration
│   │   │   ├── agents/           # Specialized AI agents
│   │   │   └── orchestrator/     # LangGraph coordination
│   │   ├── config/               # Configuration files
│   │   ├── jobs/                 # Background cron jobs
│   │   ├── modules/              # Feature modules
│   │   │   ├── admin/           # Admin operations
│   │   │   ├── conversation/    # Message handling
│   │   │   ├── notification/    # Email notifications
│   │   │   └── ticket/          # Ticket management
│   │   ├── utils/               # Utility functions
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── pages/               # React page components
    │   │   ├── LandingPage.tsx      # Ticket creation
    │   │   ├── TicketView.tsx       # Customer ticket view
    │   │   ├── AdminDashboard.tsx   # Admin ticket list
    │   │   └── AdminTicketDetail.tsx # Admin detail view
    │   ├── services/            # API client
    │   │   └── api.ts          # Axios API calls
    │   ├── types/              # TypeScript definitions
    │   ├── App.tsx             # Main app component
    │   └── main.tsx            # React entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **MongoDB**: v6.x or higher (local or MongoDB Atlas)
- **OpenAI API Key**: Required for AI agents
- **SMTP Server**: For email notifications (e.g., Gmail, SendGrid)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5200
   NODE_ENV=development
   
   # MongoDB
   MONGO_URI=mongodb://localhost:27017/ticket-system
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key_here
   
   # SMTP Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@support.com
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGO_URI
   ```

5. **Start the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5200`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables (optional)**
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5200/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Client will run on `http://localhost:5173`

## 📡 API Endpoints

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets` | Create a new ticket |
| GET | `/api/tickets/:id` | Get ticket details |
| GET | `/api/tickets` | Get all tickets |

### Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations/tickets/:ticketId/messages` | Get ticket messages |
| POST | `/api/conversations/tickets/:ticketId/messages` | Add a message |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/tickets` | Get dashboard tickets |
| PATCH | `/api/admin/tickets/:id/approve` | Approve AI response |
| PATCH | `/api/admin/tickets/:id/reject` | Reject AI response |

## 🤖 AI Agent Types

### 1. Refund Agent
Handles refund requests, payment issues, and billing inquiries.

**Keywords**: refund, payment, charge, billing, money, cancel order

### 2. Technical Agent
Resolves technical issues, bugs, and product functionality problems.

**Keywords**: bug, error, crash, broken, not working, technical

### 3. General Agent
Handles all other inquiries including general questions and account issues.

**Default** agent when classification confidence is low.

## 🔄 Workflow

1. **Ticket Creation**: Customer submits a ticket through the landing page
2. **AI Classification**: Orchestrator analyzes ticket and routes to appropriate agent
3. **AI Response**: Selected agent generates response
4. **Confidence Check**: 
   - High confidence (>0.7): Response sent automatically
   - Low confidence (≤0.7): Routed to admin for approval
5. **Admin Review**: Admin can approve or reject AI responses
6. **Customer Interaction**: Customers can reply and continue conversation
7. **Escalation**: Automatic escalation if no response within timeout period

## 🛠️ Available Scripts

### Backend
```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm run build    # Compile TypeScript to JavaScript
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Frontend Pages

### Landing Page (`/`)
- Public ticket submission form
- Email, subject, and description inputs
- Success confirmation with ticket ID

### Ticket View (`/tickets/:id`)
- View ticket details and status
- Real-time conversation thread
- Send messages as customer

### Admin Dashboard (`/admin`)
- List all tickets with filtering
- Search by email or subject
- Status and priority filters
- Confidence score display

### Admin Ticket Detail (`/admin/tickets/:id`)
- Full ticket and conversation history
- Approve/reject AI responses
- View AI confidence score
- Admin action controls

## 📊 Ticket Statuses

- `OPEN`: New ticket awaiting AI processing
- `IN_PROGRESS`: AI agent is working on response
- `WAITING_FOR_USER`: Waiting for customer reply
- `WAITING_FOR_ADMIN`: Low confidence, needs admin review
- `RESOLVED`: Issue resolved
- `CLOSED`: Ticket closed

## 💡 Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5200` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/tickets` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `user@gmail.com` |
| `SMTP_PASS` | SMTP password | `app-password` |
| `SMTP_FROM` | From email address | `noreply@support.com` |

### Frontend Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api` |

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check Atlas connection
- Verify `MONGO_URI` in `.env` file

### OpenAI API Error
- Check `OPENAI_API_KEY` is valid and has credits
- Verify API key permissions

### Email Not Sending
- Confirm SMTP credentials are correct
- For Gmail, use App Password instead of regular password
- Check firewall/network settings for SMTP port

### CORS Issues
- Backend CORS is configured to allow all origins
- For production, update `cors()` in `app.ts` with specific origins


