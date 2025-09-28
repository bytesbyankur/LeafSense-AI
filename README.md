# 🌿 LeafSense AI - Plant Disease Detection

An AI-powered web application that identifies plant diseases from leaf images. This project uses a machine learning model trained with Google's Teachable Machine and provides a detailed analysis report, including remedies, which can be sent directly to a user's WhatsApp.



## ✨ Features

- **AI-Powered Disease Detection:** Utilizes a TensorFlow.js model to identify multiple plant diseases, nutrient deficiencies, or healthy leaves with high accuracy.
- **Dual Image Input:** Supports both live webcam capture and local file uploads for analysis.
- **Instant Analysis Reports:** Generates a professional, detailed PDF report that includes:
    - The analyzed image.
    - The predicted disease with a confidence score.
    - A detailed description, common causes, and suggested remedies (both organic and chemical).
- **WhatsApp Integration:** Sends the generated PDF report directly to any opted-in phone number using the Twilio API.
- **Modern & Responsive UI:** A clean, professional, and mobile-friendly interface built with a "frosted glass" aesthetic.

---

## 💻 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Machine Learning:** TensorFlow.js & Google Teachable Machine
- **Backend:** Node.js & Express.js
- **PDF Generation:** jsPDF
- **API Integration:** Twilio API for WhatsApp Messaging
- **Deployment/Tunneling:** Ngrok (for local development)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine.
- A Twilio account with a configured WhatsApp Sandbox.
- A free Ngrok account to expose your local server.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/Your-Repo-Name.git](https://github.com/YourUsername/Your-Repo-Name.git)
    cd Your-Repo-Name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    - Create a new file in the root directory named `.env`.
    - Add the following content, replacing the placeholders with your actual credentials:
      ```
      # Your Twilio Account SID and Auth Token from [twilio.com/console](https://twilio.com/console)
      TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      TWILIO_AUTH_TOKEN=your_auth_token_here

      # Your Twilio WhatsApp Sandbox number
      TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

      # Your public server URL (from Ngrok)
      BASE_PUBLIC_URL=[https://your-ngrok-url.ngrok-free.app](https://your-ngrok-url.ngrok-free.app)
      ```

4.  **Run the application:**
    - In one terminal, start the server:
      ```bash
      node server.js
      ```
    - In a second terminal, start Ngrok to get your public URL:
      ```bash
      ngrok http 3000
      ```
    - Update the `BASE_PUBLIC_URL` in your `.env` file with the Ngrok URL, and restart the server.

5.  Open the Ngrok URL in your browser to use the application.

---

## 🏛️ Project Architecture

The application is composed of three main parts:

1.  **Frontend (Client-Side):** The user interface where images are captured or uploaded. It uses TensorFlow.js to load the Teachable Machine model and perform inference directly in the browser. It also uses jsPDF to generate the report client-side.
2.  **Backend (Server-Side):** A lightweight Express.js server responsible for handling the Twilio integration. It receives the generated PDF and a phone number from the frontend, then securely calls the Twilio API to send the WhatsApp message.
3.  **Twilio API:** An external service that connects the backend to the WhatsApp messaging network, allowing for the automated sending of the PDF report.
