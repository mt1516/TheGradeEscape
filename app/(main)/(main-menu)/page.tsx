import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">The Grade Escape</h1>

      <div className="grid grid-cols-1 gap-4 w-3/6">
        <div className="flex flex-row justify-center">
          <Link
            className="w-3/6 font-bold py-2 px-4 rounded text-center bg-green-500 hover:bg-green-600 text-white "
            href="/game-level">
            Hell Start
          </Link>
        </div>
        <div className="flex flex-row justify-center">
          <Link
            className="w-3/6 font-bold py-2 px-4 rounded text-center bg-red-500 hover:bg-red-600 text-white"
            href="/character">
            Character
          </Link>
        </div>
        <div className="flex flex-row justify-center">
          <Link
            className="w-3/6 font-bold py-2 px-4 rounded text-center bg-blue-500 hover:bg-blue-600 text-white"
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
  );
}