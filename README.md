# Sweetheart Catcher

Sweetheart Catcher is a pastel arcade mini-game where you guide a cute bow left and right to catch falling hearts before time runs out.

- Soft, dreamy palette with sprinkled gradients keeps the vibe cozy.
- Keyboard and pointer (touch/mouse) input are both supported.
- Hearts speed up slightly over time to keep things sweetly challenging.
- Sparkles pop when you snag a heart and your final score gets a celebratory badge.

## Getting Started

1. Clone or download this folder to your computer (OneDrive sync works fine too).
2. Open the `index.html` file directly in your favorite modern browser — double-clicking is enough. No build tooling needed.
3. Optional: if you prefer an auto-refresh workflow, open the folder in VS Code and launch `index.html` with the Live Server extension.

## How to Play

- Press **Start the sweetness** to begin the 30-second round.
- Move the bow: use the **Left/Right Arrow keys** (or `A/D`), or drag on touch screens.
- Catch as many pastel hearts as you can to stack up points.
- When time is up, check the "You’re so sweet!" finale overlay for your final score.

## Project Structure

```
index.html   # Page markup and layout
style.css    # Pastel styling, heart/bow art, sparkles, end-screen
script.js    # Game loop, heart spawning, input handling, scoring
```

## Customizing

- Adjust heart spawn speed or duration inside `script.js` if you want a gentler or speedier pace.
- Swap colors or font choices in `style.css` for different moods.
- Add more sparkle animations or power-ups by extending the collision handler in `script.js`.

Enjoy crafting your own sweet high score! 💖
