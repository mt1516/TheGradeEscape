import { checkPlayed, GAMEMODE_DIFFICULTY } from "@/app/game/storage";
import Link from "next/link";

export default function Level() {
    var DTWS_EASY =
        <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
            href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "easy" } }}
        >
            Assignment
        </Link>
    if (checkPlayed(GAMEMODE_DIFFICULTY.DTWS_EASY)) {
        DTWS_EASY =
        <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
            Assignment
        </div>
    }
    return (
        <div className="flex flex-col w-fit h-full flex-wrap">
            <div className="grid grid-rows-3 gap-5 h-4/6 w-fit items-center justify-self-start">
                <div className="container px-6 py-3 text-black text-wrap w-fit justify-self-start text-lg">
                    Don't Take Wrong Steps
                </div>
                <div className="container px-6 py-3 text-black text-wrap w-fit justify-self-start text-lg">
                    Dancing in the Dark
                </div>
                <div className="container px-6 py-3 text-black text-wrap w-fit justify-self-start text-lg">
                    Don't Bump the Wall
                </div>
            </div>
            <div className="grid grid-rows-3 gap-5 h-4/6 w-10/12 justify-self-center">
                <div className="grid grid-cols-3 gap-4 mx-3 w-11/12 justify-self-center">
                    <div className="container flex flex-col justify-center items-center">
                        {DTWS_EASY}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "easy" } }}
                        >
                            Assignment
                        </Link> */}
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "medium" } }}
                        >
                            Quiz
                        </Link>
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "hard" } }}
                        >
                            Midterm
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mx-3 w-11/12 justify-self-center">
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "easy" } }}
                        >
                            Assignment
                        </Link>
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "medium" } }}
                        >
                            Quiz
                        </Link>
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "hard" } }}
                        >
                            Midterm
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mx-3 w-11/12 justify-self-center">
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "easy" } }}
                        >
                            Assignment
                        </Link>
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "medium" } }}
                        >
                            Quiz
                        </Link>
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "hard" } }}
                        >
                            Midterm
                        </Link>
                    </div>
                </div>
            </div>
            <div className="h-4/6 mx-5 text-2xl font-bold text-black content-center">
                FINAL EXAM
            </div>
        </div>
    );
}