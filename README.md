
# Dakar GO delivery PRO

Dakar GO delivery PRO is a modern web application designed for professional delivery management, specifically tailored for merchants in Dakar, Senegal. It leverages Next.js for a robust frontend, Genkit for AI-powered features like delivery time estimation, and ShadCN UI with Tailwind CSS for a sleek, responsive user interface.

## Features

### Merchant App Features
*   **User Authentication**: Secure login and signup functionality for merchants.
*   **Merchant Dashboard**: A central hub for merchants to view, filter, and manage their delivery orders.
*   **Order Creation**: Intuitive form for creating new delivery orders, including pickup/delivery addresses, customer details, order items, and special instructions.
*   **Vehicle Selection**: Choose from various vehicle types (scooter, van, truck, car/tricycle) for each delivery.
*   **AI-Powered Delivery Estimation**: Get intelligent delivery time estimates based on order details and (simulated) Dakar traffic conditions using Genkit and Google AI.
*   **Detailed Order View**: Access comprehensive details for each order, including status, customer information, addresses, items, and total amount.
*   **Status Filtering**: Filter orders on the dashboard by their current status (e.g., Pending, In Transit, Delivered).
*   **Real-Time Driver Tracking**: Track drivers on an interactive map with real-time location updates and estimated arrival times.

### Driver App Features
*   **Driver Authentication**: Secure login system specifically for delivery drivers.
*   **Order Management**: View, accept, and manage delivery orders assigned to the driver.
*   **Real-Time Location Sharing**: Share driver location in real-time with merchants and customers.
*   **Order Status Updates**: Update order status (accepted, picked up, in transit, delivered) throughout the delivery process.
*   **Navigation**: Built-in navigation system to guide drivers to pickup and delivery locations.
*   **Driver Profile**: Manage driver information, vehicle details, and performance metrics.
*   **Earnings Tracking**: Monitor completed deliveries and earnings.

### General Features
*   **Responsive Design**: Optimized for a seamless experience across desktop and mobile devices.
*   **Modern Tech Stack**: Built with Next.js App Router, TypeScript, and Server Components for performance and scalability.

## Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: ShadCN UI, Lucide Icons
*   **Mapping**: Leaflet with React-Leaflet
*   **AI Integration**: Genkit with Google AI (Gemini models)
*   **Form Handling**: React Hook Form
*   **Validation**: Zod
*   **State Management**: React Context API (for Authentication)
*   **Server Actions**: Next.js Server Actions for form submissions and backend logic.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd dakar-go-delivery-pro 
    ```
    (Replace `<repository-url>` with the actual URL of your GitHub repository)

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root of your project. You may need to add API keys or other configuration if you extend AI capabilities or integrate with actual backend services. For the current Genkit setup with Google AI, ensure your environment is configured for `gcloud` access or set `GOOGLE_API_KEY` if required by your GoogleAI plugin configuration.
    ```env
    # Example .env content (add actual keys if needed)
    # GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY 
    ```
    *(Note: The current `src/ai/genkit.ts` initializes GoogleAI without explicitly requiring an API key from `.env`, it might rely on application default credentials or a globally configured gcloud CLI. If you encounter authentication issues with Genkit, ensure your Google Cloud environment is set up correctly or provide an API key.)*


4.  **Run the Development Servers**:
    You'll need to run two development servers concurrently: one for the Next.js application and one for Genkit.

    *   **Next.js App**:
        ```bash
        # Use the provided script to start the app
        ./start-app.sh
        ```
        This will start the app on the configured port.

    *   **Driver App**:
        To specifically test the driver app:
        ```bash
        ./start-driver-app.sh
        ```
        This will start the app with focus on the driver features.

    *   **Genkit AI Flows**:
        Open a new terminal window and run:
        ```bash
        npm run genkit:dev
        # or for auto-reloading on changes
        npm run genkit:watch
        ```
        This will start the Genkit development server, usually on `http://localhost:3400`, making the AI flows available to the Next.js app.

## Available Scripts

*   `npm run dev`: Starts the Next.js development server (with Turbopack).
*   `npm run genkit:dev`: Starts the Genkit development server for AI flows.
*   `npm run genkit:watch`: Starts the Genkit development server in watch mode.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Lints the codebase using Next.js's ESLint configuration.
*   `npm run typecheck`: Performs TypeScript type checking.

## Authentication

### Merchant Authentication
The application includes a mock authentication system for merchants. To test the merchant sections of the app (Dashboard, Create Order, Order Details):

*   **Email**: `marchand@dakar.go`
*   **Password**: `password123`

You can also use the Signup page to create a (mock) new merchant user.

### Driver Authentication
For testing the driver app, use one of the following mock driver accounts:

*   **Email**: `moussa.sow@dakar.go`
*   **Password**: `password123`

Or:

*   **Email**: `fatou.diallo@dakar.go`
*   **Password**: `password123`

## AI Features

The application leverages Genkit to integrate AI capabilities:

*   **Delivery Time Estimation**: When creating an order, users can request an AI-powered estimation of the delivery time. This feature uses a Genkit flow (`estimateDeliveryTimeFlow`) that takes into account pickup/delivery addresses, vehicle type, and order items.
*   **Address to GPS Translation**: An AI flow (`translateAddressToGPSFlow`) is defined to convert textual French addresses into GPS coordinates. While present, its UI integration might be planned for future updates.

These flows are defined in `src/ai/flows/`.

## Project Structure

A brief overview of the key directories:

*   `src/app/`: Contains all Next.js App Router pages, layouts, and route handlers.
    *   `src/app/driver/`: Driver app pages and routes.
*   `src/components/`:
    *   `ui/`: ShadCN UI components.
    *   `auth/`: Authentication-related components (LoginForm, SignupForm).
    *   `core/`: Core application components (OrderCard, CreateOrderForm, TrackingMap, NavigationMap, etc.).
    *   `layout/`: Layout components like Header, AppLayout, and DriverLayout.
*   `src/actions/`: Server Actions for handling form submissions and other backend logic.
*   `src/ai/`:
    *   `flows/`: Genkit AI flow definitions.
    *   `genkit.ts`: Genkit initialization and configuration.
    *   `dev.ts`: Entry point for the Genkit development server.
*   `src/contexts/`: React Context providers (e.g., `AuthContext`).
*   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useIsMobile`).
*   `src/lib/`: Utility functions (`utils.ts`) and type definitions (`types.ts`).
*   `public/`: Static assets like images.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please ensure your code adheres to the project's linting and formatting standards.

## License

This project is currently unlicensed. (Consider adding an open-source license like MIT if applicable).
```