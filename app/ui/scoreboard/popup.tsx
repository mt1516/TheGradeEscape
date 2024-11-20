import Popup from "reactjs-popup";
import { resetCurrentGame, resetScoreBoard, initStorage } from "@/app/game/storage";

export enum TYPE {
    GAME = 'reset entire game',
    BOARD = 'reset score board',
    ALL = 'reset all'
}

const confirmMessage = {
    [TYPE.GAME]: 'involves resetting the current grade and game progress',
    [TYPE.BOARD]: 'reset only score board',
    [TYPE.ALL]: 'reset all: game progress, score board, current grade, and character'
}

export default function Confirm(props: {
    type: TYPE;
    closePopup: () => void;
}) {
    return (
        <Popup open={true} closeOnDocumentClick={false}>
            <div className="container flex flex-col bg-gray-500 rounded-lg shadow-lg h-1/5 p-10">
                <h1 className="text-3xl font-bold text-black w-full text-center justify-self-center my-2">Are you sure you want to {props.type}?</h1>
                <div className="container flex flex-col text-black text-center text-xl w-full my-2">
                    <p>This action {confirmMessage[props.type]}</p>
                    <p>Proceed with caution!</p>
                </div>
                <div className="container flex flex-row justify-around items-center h-1/5 w-full my-2">
                    <button className="h-fit w-1/5 text-center text-2xl bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => {
                            props.closePopup();
                            switch (props.type) {
                                case TYPE.GAME:
                                    resetCurrentGame();
                                    break;
                                case TYPE.BOARD:
                                    resetScoreBoard();
                                    break;
                                case TYPE.ALL:
                                    initStorage();
                                    break;
                            }
                        }}>
                        Yes
                    </button>
                    <button className="h-fit w-1/5 text-center text-2xl bg-red-500 hover:bg-red-600 text-white"
                        onClick={props.closePopup}>
                        No
                    </button>
                </div>
            </div>
        </Popup>
    );
} 