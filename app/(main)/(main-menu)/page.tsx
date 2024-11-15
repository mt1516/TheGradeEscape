import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-row justify-center items-center h-screen'>
      <div className="bg-white rounded-lg shadow-lg w-8/12 h-4/6">
        <h1 className="text-7xl font-bold text-center my-12 p-3 animate-[title_0.7s_linear_infinite] text-black">The Grade Escape</h1>
        <div className="grid grid-cols-1 gap-4 w-3/6 relative">
          <div className="flex flex-row justify-center my-4">
            <Link
              className="w-3/6 font-bold py-3 px-4 rounded text-center bg-green-500 hover:bg-green-600 text-white "
              href="/game-level">
              Hell Start
            </Link>
          </div>
          <div className="flex flex-row justify-center my-4">
            <Link
              className="w-3/6 font-bold py-3 px-4 rounded text-center bg-red-500 hover:bg-red-600 text-white"
              href="/character">
              Character
            </Link>
          </div>
          <div className="flex flex-row justify-center my-4">
            <Link
              className="w-3/6 font-bold py-3 px-4 rounded text-center bg-blue-500 hover:bg-blue-600 text-white"
              href="/credits">
              Credits
            </Link>
          </div>
          <div className="flex flex-row justify-center">
            <div className="text-black">
              V.I
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}