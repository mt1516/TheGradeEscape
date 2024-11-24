import Link from 'next/link';

export default function Buttons() {
  return (
    <div className="container flex flex-col h-5/6 w-1/3 justify-self-start items-center">
      <div className="grid grid-rows-5 gap-12 w-fit h-full justify-center">
        <div className="container h-full w-full flex flex-row justify-center mx-6">
          <Link
            className="w-full h-full font-bold rounded text-center content-center text-2xl bg-green-500 hover:bg-green-600 text-white "
            href="/game-level">
            Hell Start
          </Link>
        </div>
        <div className="container h-full w-full flex flex-row justify-center mx-6">
          <Link
            className="w-full h-full font-bold rounded text-center content-center text-2xl bg-red-500 hover:bg-red-600 text-white"
            href="/character">
            Character
          </Link>
        </div>
        <div className="container h-full w-full flex flex-row justify-center mx-6">
          <Link
            className="w-full h-full font-bold rounded text-center content-center text-2xl bg-blue-500 hover:bg-blue-600 text-white"
            href="/credits">
            Credits
          </Link>
        </div>
        <div className="container h-full w-full flex flex-row justify-center mx-6">
          <Link
            className="w-full h-full font-bold rounded text-center content-center text-2xl bg-yellow-500 hover:bg-yellow-600 text-white"
            href="/scoreboard">
            Score Board
          </Link>
        </div>
        <div className="container h-full w-full flex flex-row justify-center mx-6">
          <Link
            className="w-full h-full font-bold rounded text-center content-center text-2xl bg-purple-500 hover:bg-purple-600 text-white"
            href="/instruction">
            Instruction
          </Link>
        </div>
      </div>
    </div>
  );
}