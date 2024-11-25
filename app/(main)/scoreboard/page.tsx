import Close from "@/app/ui/button";
import Buttons from "@/app/ui/scoreboard/button";
import Scoreboard from "@/app/ui/scoreboard/scoreboard";

export default function Page() {
  return (
    <div className='flex flex-row justify-center items-center h-screen w-screen'>
      <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-5/6 p-10">
        <div className="container flex flex-row">
          <Close />
          <h1 className="text-7xl font-bold text-black w-full text-center justify-self-center">Score Board</h1>
        </div>
        <div className="container flex flex-col w-full h-full items-center my-10">
          <Scoreboard />
          <Buttons />
        </div>
      </div>
    </div>
  );
}