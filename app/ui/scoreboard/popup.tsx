import Popup from "reactjs-popup";

export enum TYPE {
    GRADE = 'reset grade',
    BOARD = 'reset score board',
    GAME = 'reset entire game'
}

export default function Confirm(props: {
    type: TYPE;
    closePopup: () => void;
}) {
    return (
        <Popup open={true} closeOnDocumentClick={false}>
            <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-1/5 p-10">
                <h1 className="text-3xl font-bold text-black w-full text-center justify-self-center">Are you sure you want to {props.type}?</h1>
                <div className="container flex flex-row justify-center items-center h-1/5 w-full">
                    <button className="h-fit text-black w-1/5 text-center text-2xl"
                        onClick={() => {
                            props.closePopup();
                            // Your function here
                            console.log('yes');
                        }}>
                        Yes
                    </button>
                    <button className="h-fit text-black w-1/5 text-center text-2xl"
                        onClick={props.closePopup}>
                        No
                    </button>
                </div>
            </div>
        </Popup>
    );
} 