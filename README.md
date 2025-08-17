# Tradeverse 📈

Tradeverse is a modern, open-source stock market simulation application designed for educational purposes. It allows users to learn the ropes of stock trading, portfolio management, and market analysis in a risk-free, real-time simulated environment.

![StockFlow Login Page](https://i.ibb.co/GvMF3Yqz/an-image-displaying-a-stock-market-chart-with-rising-or-falling-trends-allowing-space-for-text-backg.jpg)

## ✨ About The Project

This application provides a hands-on experience for individuals interested in finance and technology. Users can sign up, receive virtual currency, and start trading a wide variety of simulated stocks and ETFs. The platform features dynamic charts, detailed asset information, and a personal portfolio to track investments.

What sets StockFlow apart is its integration of AI-powered features, including a helpful assistant to answer user queries and an AI avatar generator to personalize user profiles.

## 🚀 Core Features

-   **👤 User Authentication**: Secure sign-in and sign-up functionality.
-   **💹 Real-Time Stock Listings**: View a wide variety of stocks and ETFs with simulated real-time price updates.
-   **📊 Detailed Asset Information**: Access in-depth information for each asset, including movable graphs, 52-week highs/lows, and market capitalization.
-   **💸 Buy/Sell Functionality**: Execute buy and sell orders with a virtual wallet, with all transactions recorded in a history log.
-   **📈 Portfolio Management**: A dedicated portfolio page with a pie chart visualizing asset allocation and overall profit/loss.
-   **🤖 AI-Powered Assistant**: An integrated AI chat assistant to help with stock market questions or app-related queries.
-   **🎨 AI Avatar Generation**: Users can generate a unique, funny cartoon avatar for their profile using a descriptive prompt.
-   **❤️ Watchlist**: Keep track of interesting stocks and ETFs by adding them to a personal watchlist.
-   **📱 Fully Responsive**: A smooth, modern, and responsive design that works seamlessly on both desktop and mobile devices.

## 🛠️ Built With

StockFlow is built with a modern, robust, and scalable tech stack.

-   **[Next.js](https://nextjs.org/)** - React Framework for Production
-   **[React](https://reactjs.org/)** - A JavaScript library for building user interfaces
-   **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript for robust applications
-   **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework
-   **[ShadCN UI](https://ui.shadcn.com/)** - Beautifully designed, reusable components
-   **[Genkit](https://firebase.google.com/docs/genkit)** - AI toolkit for building generative AI features
-   **[MongoDB](https://www.mongodb.com/)** - NoSQL database for storing user data
-   **[Recharts](https://recharts.org/)** - A composable charting library for React
-   **[Framer Motion](https://www.framer.com/motion/)** - For smooth animations and transitions

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed on your machine.
-   [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/stockflow.git
    cd stockflow
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root of your project and add your MongoDB connection string.
    ```env
    MONGODB_URI="your_mongodb_connection_string"
    ```
    *You will also need to add your `GEMINI_API_KEY` to this file to enable the AI features.*
    ```env
    GEMINI_API_KEY="your_gemini_api_key"
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
