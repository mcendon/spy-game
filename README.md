# El Topo Online (Spy Game)

A modern, web-based implementation of the classic social deduction party game. "El Topo Online" (The Mole Online) challenges players to find the spy among them while the spy tries to blend in and guess the secret location.

![El Topo Online](/src/assets/topo.png)

## 🎮 How to Play

1.  **Setup**: Configure the number of players, number of spies, and choose categories.
2.  **Role Reveal**: Pass the device around. Each player sees their role (Citizen or Spy) and the secret word (if they are a Citizen).
3.  **Gameplay**: Players ask each other questions to deduce who doesn't know the secret word.
4.  **The Goal**:
    -   **Citizens**: Identify the Spy.
    -   **Spy**: Guess the secret location/word without being caught.

## ✨ Features

-   **Flexible Game Setup**:
    -   Adjustable player count (3+ players).
    -   Configurable number of spies.
    -   Customizable player names with drag-and-drop reordering.
    -   Randomly generated avatars for each player.
-   **Rich Categories**:
    -   Includes diverse default categories: _Lugares, Animales, Comida, Personajes, Peliculas, Oficios_, and more.
    -   **Custom Categories**: Create and manage your own categories and words.
    -   **Random Mode**: Let the game pick a random category for you.
-   **Smooth Experience**:
    -   Mobile-first, responsive design.
    -   Sleek animations using GSAP.
    -   Dark mode interface.
-   **Persistence**: Game settings and custom categories are automatically saved to your browser's local storage.

## 🛠️ Tech Stack

-   **Framework**: [Vue 3](https://vuejs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [GSAP](https://greensock.com/gsap/)
-   **Drag & Drop**: [@formkit/drag-and-drop](https://drag-and-drop.formkit.com/)
-   **Avatars**: [DiceBear API](https://www.dicebear.com/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16 or higher recommended)
-   npm

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd spy-game
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal).

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` directory.

## 📂 Project Structure

-   `src/components/`: Vue components for game screens (Setup, Role Reveal, Gameplay, etc.).
-   `src/composables/`: Shared game logic and state management (`useGame.js`).
-   `src/assets/`: Images and static resources.
-   `src/style.css`: Global styles and Tailwind directives.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
