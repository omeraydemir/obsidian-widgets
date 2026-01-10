# Agents

This file provides context for AI agents working on this codebase.

## Project Overview
This project is an Obsidian plugin called "TimeWidget" that provides various time management widgets (Clock, Stopwatch, Countdown, Counter).

## Tech Stack
-   **Framework**: Obsidian Plugin API
-   **UI Library**: React (with `createRoot`)
-   **Language**: TypeScript
-   **Build Tool**: esbuild

## Key Directories
-   `src/`: Source code
    -   `Stopwatch/`: Stopwatch component
    -   `Countdown/`: Countdown component
    -   `Clock/`: Clock component
    -   `Counter/`: Counter component
    -   `types/`: TypeScript definitions
-   `public/`: Static assets

## Conventions
-   Use `React.useState` and `React.useEffect` hooks.
-   Styles are defined in `styles.css` (or scss if configured, but currently css).
-   Widgets are rendered into the Obsidian workspace via `WidgetView`.

## Helper Functions
-   `helperFunctions`: passed down to components to interact with Obsidian API (e.g., reading/writing data.json).
