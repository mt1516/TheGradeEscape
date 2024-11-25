This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It is a game that we created for our final project in the course of COMP4451 - Game Development at the Hong Kong University of Science and Technology.

## Table of Contents
- [The Grade Escape](#the-grade-escape)
- [Game Controls](#game-controls)
- [Game Description](#game-description)
- [Authors](#authors)

## The Grade Escape

First, install the package using Makefile:

```bash
make npm-install
# or
make bun-install
```

Then, run the development server:

```bash
make bun-run
# or
make bun-run
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see our game.

## Game Controls
- **Arrow keys/WASD**: Move the player
- **Mouse**: Click on the buttons in the game

## Game Description
The Grade Escape is a 2D maze game where the player is a student trying to escape from the University of Stress and Tension (commonly known as HKUST). 

<br /> There are 3 game modes in the game: 
- **Don't Take Wrong Steps**: The player steps count is limited. The player has to reach the exit within the steps limit and the time limit.
- **Dancing In The Dark**: The maze is dark and the player can only see a small area around him. The player has to reach the exit within the time limit.
- **Don't Bump The Wall**: The player has to reach the exit without bumping into the wall too much. Bumping into walls will lose one heart The player has to reach the exit within the time limit.

<br /> There are 4 difficulties in the game: 
- **Assignment**: The easiest difficulty. The maze is generated using Prim's algorithm, which is the simplest in maze complexity.
- **Quiz**: The maze is bigger and generated using Eller's algorithm, which is more complex than Prim's algorithm.
- **Midterm**: The maze is bigger and generated using Recursive Backtrace algorithm, that the generated maze is most complex.
- **Final**: The hardest difficulty. The maze generated mechenism is the same as the Midterm difficulty, but the player has to reach the exit while escaping from the Professor.

<br /> There are 4 characters in the game: 
- **Regular**: The default character. The character has no buff and de-buff.
- **CS Guy**: A nerd with glasses. The character can see better in the dark but less time to finish the maze.
- **Business Guy**: A guy with a suit often running like a pro in university. The character can run faster but needs to be careful not to bump into walls.
- **Cat**: A cat can have one more life but with 50% less immunity time. (IDK why we add cat, but who else doesn't like a cat? :>>>)

## More things to add to the game if we have time
- **More levels**: We can add more levels to the game with different themes and difficulties.
- **More characters**: We can add more characters to the game with different abilities.
- **More game modes**: We can add more game modes to the game with different objectives.
- **More obstacles**: We can add more obstacles to the game to make it more challenging.
- **More sound effects and music**: We can add more sound effects and music to the game to make it more immersive.
- **Add power-ups**: We can add power-ups to the game to make it more interesting.
- **Add multiplayer mode**: We can add a multiplayer mode to the game to make it more fun.
- **Add 3D mode**: We can add a 3D mode to the game to make it more realistic.
- **Add starting and ending animation**: We can add starting and ending animation to the game to make it more cinematic.
- **Merge the storyline into the game**: We can merge the storyline into the game to make it more engaging.
- **Better AI**: Make use of reinforcement learning to make the AI smarter.
- **Better UI**: Make the UI more user-friendly.
- **Customerize game mode**: Allow the player to customize the game mode.
- **Customerize character**: Allow the player to customize the character using texture packages.

## Authors
- **Yuen Man Him, Bosco** - @[bosco713](https://github.com/bosco713)
- **Tong Tsun Man, Melvin** -@[mt1516](https://github.com/mt1516)