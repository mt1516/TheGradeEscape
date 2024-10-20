// player.js

class Player {
    constructor(startX, startY, maze) {
        this.x = startX;
        this.y = startY;
        this.maze = maze; // Reference to the maze for collision detection
    }

    move(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Check if the new position is within bounds and not a wall
        if (this.isValidMove(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.updatePosition();
            console.log('Player moved successfully, x:', this.x, 'y:', this.y);
        }
    }

    isValidMove(x, y) {
        // Assuming maze is a 2D array where 0 is a path and 1 is a wall
        return (
            x >= 0 &&
            y >= 0 &&
            y < this.maze.length &&
            x < this.maze[0].length &&
            this.maze[y][x] === 1
        );
    }

    updatePosition() {
        // Update the player's visual representation (e.g., position on a canvas)
        console.log(`Player moved to: (${this.x}, ${this.y})`);
        // Here you would typically update the rendering of the player
    }
}

// Export the Player class
export default Player;