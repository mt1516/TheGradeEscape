import React from 'react';
import styles from './mainMenu.module.css';

const MainMenu = ({onStartGame, onSelectCharacter, onViewCredits}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Main Title</h1>
        <h2>Secondary Title</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.menu}>
          <button onClick={onStartGame}>Start Game</button>
          <button onClick={onSelectCharacter}>Select Character</button>
          <button onClick={onViewCredits}>Credits</button>
        </div>
        <div className={styles.imageSection}>
          <img src="/texture/ust.png" alt="Character" />
        </div>
      </div>
    </div>
  );
};

export default MainMenu;