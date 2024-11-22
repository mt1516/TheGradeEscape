import { Popup } from 'reactjs-popup';

export default function SelectionConfirm(props: {
  closePopup: () => void;
}) {
  return (
    <Popup open={true} closeOnDocumentClick={false}>
      <div className="container flex flex-col bg-gray-400 rounded-lg shadow-lg h-5/6 p-10">
        <h1 className="text-4xl font-bold text-black w-full text-center justify-self-center my-2">Character Selection Succeed</h1>
        <div className="container flex flex-row justify-center">
          <button className="container text-black text-center text-4xl w-1/4 h-1/2 rounded-md border-2 border-black"
            onClick={props.closePopup}>
            Close
          </button>
        </div>
      </div>
    </Popup>
  );
}