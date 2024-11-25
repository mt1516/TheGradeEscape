import { characters, characterTotal, characterLayoutClassName, characterClassName } from "@/app/game/player/character";
import { setCurrentCharacter } from "@/app/game/storage";
import SelectionConfirm from "./popup";
import { useState } from "react";

export default function Choose(props: {
  current: number;
}) {
  const [selectionConfirmPopup, setSelectionConfirmPopup] = useState(false);
  const closeSelectionConfirmPopup = () => {
    setSelectionConfirmPopup(false);
    window.location.href = "/";
  }
  return (
    <div className="container flex flex-col h-full w-full justify-center">
      {selectionConfirmPopup && <SelectionConfirm closePopup={closeSelectionConfirmPopup} />}
      <div className="container flex flex-col h-5/6 w-full justify-self-start items-center">
        <div className="flex flex-col w-5/6 h-full justify-center items-start text-black">
          <div className={characterLayoutClassName[characterTotal as keyof typeof characterLayoutClassName]}>
            <div className={`${characterClassName[props.current % characterTotal].selected}`}
            style={{
              backgroundImage: `${characterClassName[props.current % characterTotal].image}`
            }}>
              {characters[props.current % characterTotal].name}
            </div>
            {(() => {
              let elements = [];
              for (let i = 1; i < characterTotal; i++) {
                elements.push(
                  <div key={i} className={`${characterClassName[(props.current + i) % characterTotal].unselected}`}
                  style={{
                    backgroundImage: `${characterClassName[(props.current + i) % characterTotal].image}`
                  }}>
                    {characters[(props.current + i) % characterTotal].name}
                  </div>
                );
              }
              return elements;
            })()}
          </div>
          <div className="container h-3/6 flex flex-row items-start justify-between">
            <div className="container flex flex-col w-1/6 h-full">
              <div className="container text-black text-center text-8xl w-full h-1/2 rounded-md">
                ^
              </div>
              <button className="container bg-yellow-400 hover:bg-green-600 text-black text-center text-3xl w-full h-1/2 rounded-md border-2 border-black"
                onClick={() => {
                  setCurrentCharacter(props.current);
                  setSelectionConfirmPopup(true);
                }}>
                Confirm
              </button>
            </div>
            <div className="flex flex-row w-4/5 h-full justify-around text-white">
              <div className="container bg-green-500 text-start text-xl w-1/3 h-full rounded-md p-5 border-4 border-gray-600">
                Buff: <br />
                {characters[props.current % characterTotal].buff}
              </div>
              <div className="container bg-red-500 text-start text-xl w-1/3 h-full rounded-md p-5 border-4 border-gray-600">
                Debuff: <br />
                {characters[props.current % characterTotal].debuff}
              </div>
            </div>
          </div>
        </div >
      </div >
    </div>
  );
}