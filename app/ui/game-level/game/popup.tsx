import Popup from 'reactjs-popup';

export default function Gameend(props: {
    state: number, 
    handleClosePopup: () => void
}) {
    if (props.state == 1) {
        return (
            <Popup open={true} closeOnDocumentClick={false} closeOnEscape={false} className="justify-center items-center">
                <div className="container flex flex-col bg-gray-500 border-2 border-black w-80 h-52 justify-center items-center">
                    <h1 className="text-3xl h-1/4 w-full text-center m-2">Congrets!</h1>
                    <div className="container border-2 h-3/4 w-3/4 m-4">
                        <div className='grid grid-rows-2 w-full h-full text-lg text-black justify-center'>
                            <div className='text-xl'> You win! </div>
                            <button className='bg-green-400 border-2 my-2 px-2'
                            onClick={props.handleClosePopup}>Close
                            </button>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    } else {
        return (
            <Popup open={true} closeOnDocumentClick={false} closeOnEscape={false} className="justify-center items-center">
                <div className="container flex flex-col bg-gray-500 border-2 border-black w-80 h-52 justify-center items-center">
                    <h1 className="text-3xl h-1/4 w-full text-center m-2"> Skill Issue!!! </h1>
                    <div className="container border-2 h-3/4 w-3/4 m-4">
                        <div className='grid grid-rows-2 w-full h-full text-lg text-black justify-center'>
                            <div className='text-xl text-center'> Pathetic </div>
                            <button className='bg-red-400 border-2 my-2 px-2'
                            onClick={props.handleClosePopup}>Never give up
                            </button>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    }
}