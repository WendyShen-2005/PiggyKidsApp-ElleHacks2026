## Inspiration
Traditional piggy banks teach kids how to hold money, but they don't teach them how to earn, manage, or invest it. In our increasingly cashless society, digital numbers on a screen are too abstract for a child. We built TeddyBanks to turn those invisible numbers into a tangible, interactive experience—teaching financial literacy through conversation and play.

## Key Features
Interactive Check-ins: Teddy only speaks when you want him to! Press the button on his paw to hear your financial update.

The Task Tracker: A gamified "Job Board" where kids complete chores to earn real-world rewards.

The Stock Farm: A simplified investment simulator. Instead of complex charts, kids watch their balance change based on fruit market trends.

AI-Powered Stories: Using Google Gemini, Teddy translates raw transaction logs into engaging, child-friendly narratives.

Multiligual Support: Supports any language google can translate to, helping kids learn financial literacy in multiple languages at once.

### The Tech Stack
Hardware: Arduino Uno + Angle Sensor (Serial Communication).

Frontend: React-based dashboard for task management and stock visualization.

Backend: Python + Express.js + Node.js.

Database: MongoDB Atlas (Scalable NoSQL storage for user logs and stock data).

AI & Voice: * Gemini 2.5 Flash: The "Brain" that processes logs into child-friendly scripts.

ElevenLabs: High-quality, emotive speech synthesis.

Google Nest: Our physical audio output device.

## Challenges & Learnings
The Hardware Pivot: We originally planned to use a Raspberry Pi but switched to an Arduino Uno due to connection issues. This taught us to be adaptable under tight deadlines.

Resource Constraints: Due to a lack of equipment, we built our entire hardware sensor system using only three male wires!

Data Pipelines: Building the MongoDB-to-React pipeline was a steep learning curve. We mastered schemas, API calls, and real-time state management in under 48 hours.

## What's Next for TeddyBanks
Interactive Q&A: Let kids ask Teddy direct questions like, "How much more do I need for that LEGO set?"

Financial Quizzes: Parents can assign "Knowledge Quests" where kids earn money by passing short financial literacy quizzes.

## Installation & Setup
Clone the Repo: git clone https://github.com/wendyshen-2005/PiggyKidsApp-ElleHacks2026.git

Install Dependencies

Hardware Setup: Flash the teddy_button.ino to your Arduino Uno.

Environment Variables: Set up your .env with your Gemini, ElevenLabs, and MongoDB API keys.
