import styles from './levelMenu.module.css';
const LevelMenu = ({restartGame, onDBTWeasy, onDBTWmedium, onDBTWhard, onFinalBoss}) => {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {/* <button onClick={onBackToMainMenu}>Back</button> */}
          <h1>Select your level</h1>
          <button onClick={restartGame}>Restart</button>
        </div>
        <div className={styles.content}>
          <div className={styles.menu}>
            {/* <button onClick={onStartGame}>Start Game</button>
            <button onClick={onSelectCharacter}>Select Character</button>
            <button onClick={onViewCredits}>Credits</button> */}
            <div className={styles.DBTW}>
                <h2>Don't Bump the Walls</h2>
                <button onClick={onDBTWeasy}>Easy</button>
                <button onClick={onDBTWmedium}>Medium</button>
                <button onClick={onDBTWhard}>Hard</button>
            </div>
            <div className={styles.DITD}>
                <h2>Dance In the Dark</h2>
                <button>Easy</button>
                <button>Medium</button>
                <button>Hard</button>
            </div>
          </div>
          <div className={styles.Final}>
            <button onClick={onFinalBoss}>Final Boss</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LevelMenu;