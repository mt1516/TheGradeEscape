import Popup from 'reactjs-popup';

export default function Gameend(props: {
    state: number, 
    handleClosePopup: () => void
}) {
    if (props.state == 1) {
        return (
            <Popup open={true} closeOnDocumentClick={false} closeOnEscape={false}>
                <div className="container bg-gray-500 border-2 border-black p-9 w-11/12 h-4/6">
                    <h1 className="text-3xl h-[12%]">Congrets!</h1>
                    <div className="container border-2 h-[88%]">
                        <div className='grid grid-rows-2 w-full h-full p-4 text-lg text-black'>
                            <div className='h-fit'> You win! </div>
                            <div className='h-fit'> <button onClick={props.handleClosePopup}>Close</button> </div>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    } else {
        return (
            <Popup open={true} closeOnDocumentClick={false} closeOnEscape={false}>
                <div className="container bg-gray-500 border-2 border-black p-9 w-11/12 h-4/6">
                    <h1 className="text-3xl h-[12%]">Skill Issue!!!</h1>
                    <div className="container border-2 h-[88%]">
                        <div className='grid grid-rows-2 w-full h-full p-4 text-lg text-black'>
                            <div className='h-fit'> Pathetic </div>
                            <div className='h-fit'> <button onClick={props.handleClosePopup}>Never give up</button> </div>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    }
}