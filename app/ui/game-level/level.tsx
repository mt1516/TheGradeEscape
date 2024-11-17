import { canPlayHard, canPlayMedium, checkPlayed, GAMEMODE_DIFFICULTY } from "@/app/game/storage";
import Link from "next/link";

export default function Level() {
    var DTWS_EASY = checkPlayed(GAMEMODE_DIFFICULTY.DTWS_EASY) ? DTWS_EASY_PLAYED : DTWS_EASY_NOT_PLAYED;
    var DTWS_MEDIUM = canPlayMedium() ? (checkPlayed(GAMEMODE_DIFFICULTY.DTWS_MEDIUM) ? DTWS_MEDIUM_PLAYED : DTWS_MEDIUM_NOT_PLAYED) : DTWS_MEDIUM_UNAVAILABLE;
    var DTWS_HARD = canPlayHard() ? (checkPlayed(GAMEMODE_DIFFICULTY.DTWS_HARD) ? DTWS_HARD_PLAYED : DTWS_HARD_NOT_PLAYED) : DTWS_HARD_UNAVAILABLE;
    var DITD_EASY = checkPlayed(GAMEMODE_DIFFICULTY.DITD_EASY) ? DITD_EASY_PLAYED : DITD_EASY_NOT_PLAYED;
    var DITD_MEDIUM = canPlayMedium() ? (checkPlayed(GAMEMODE_DIFFICULTY.DITD_MEDIUM) ? DITD_MEDIUM_PLAYED : DITD_MEDIUM_NOT_PLAYED) : DITD_MEDIUM_UNAVAILABLE;
    var DITD_HARD = canPlayHard() ? (checkPlayed(GAMEMODE_DIFFICULTY.DITD_HARD) ? DITD_HARD_PLAYED : DITD_HARD_NOT_PLAYED) : DITD_HARD_UNAVAILABLE;
    var DBTW_EASY = checkPlayed(GAMEMODE_DIFFICULTY.DBTW_EASY) ? DBTW_EASY_PLAYED : DBTW_EASY_NOT_PLAYED;
    var DBTW_MEDIUM = canPlayMedium() ? (checkPlayed(GAMEMODE_DIFFICULTY.DBTW_MEDIUM) ? DBTW_MEDIUM_PLAYED : DBTW_MEDIUM_NOT_PLAYED) : DBTW_MEDIUM_UNAVAILABLE;
    var DBTW_HARD = canPlayHard() ? (checkPlayed(GAMEMODE_DIFFICULTY.DBTW_HARD) ? DBTW_HARD_PLAYED : DBTW_HARD_NOT_PLAYED) : DBTW_HARD_UNAVAILABLE;
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
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        {DTWS_MEDIUM}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "medium" } }}
                        >
                            Quiz
                        </Link> */}
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        {DTWS_HARD}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "hard" } }}
                        >
                            Midterm
                        </Link> */}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mx-3 w-11/12 justify-self-center">
                    <div className="container flex flex-col justify-center items-center">
                        {DITD_EASY}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "easy" } }}
                        >
                            Assignment
                        </Link> */}
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        {DITD_MEDIUM}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "medium" } }}
                        >
                            Quiz
                        </Link> */}
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        {DITD_HARD}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "hard" } }}
                        >
                            Midterm
                        </Link> */}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mx-3 w-11/12 justify-self-center">
                    <div className="container flex flex-col justify-center items-center">
                        {DBTW_EASY}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "easy" } }}
                        >
                            Assignment
                        </Link> */}
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        {DBTW_MEDIUM}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "medium" } }}
                        >
                            Quiz
                        </Link> */}
                    </div>
                    <div className="container flex flex-col justify-center items-center">
                        {DBTW_HARD}
                        {/* <Link className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg"
                            href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "hard" } }}
                        >
                            Midterm
                        </Link> */}
                    </div>
                </div>
            </div>
            <div className="h-4/6 mx-5 text-2xl font-bold text-black content-center">
                FINAL EXAM
            </div>
        </div>
    );
}

let DTWS_EASY_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Assignment
    </div>
let DTWS_EASY_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "easy" } }}
    >
        Assignment
    </Link>
let DTWS_MEDIUM_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Quiz
    </div>
let DTWS_MEDIUM_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "medium" } }}
    >
        Quiz
    </Link>
let DTWS_MEDIUM_UNAVAILABLE =
    <div className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg">
        Quiz
    </div>
let DTWS_HARD_PLAYED = 
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Midterm
    </div>
let DTWS_HARD_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "hard" } }}
    >
        Midterm
    </Link>
let DTWS_HARD_UNAVAILABLE =
    <div className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg">
        Midterm
    </div>
let DITD_EASY_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Assignment
    </div>
let DITD_EASY_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "easy" } }}
    >
        Assignment
    </Link>
let DITD_MEDIUM_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Quiz
    </div>
let DITD_MEDIUM_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "medium" } }}
    >
        Quiz
    </Link>
let DITD_MEDIUM_UNAVAILABLE =
    <div className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg">
        Quiz
    </div>
let DITD_HARD_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Midterm
    </div>
let DITD_HARD_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "hard" } }}
    >
        Midterm
    </Link>
let DITD_HARD_UNAVAILABLE =
    <div className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg">
        Midterm
    </div>
let DBTW_EASY_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Assignment
    </div>
let DBTW_EASY_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "easy" } }}
    >
        Assignment
    </Link>
let DBTW_MEDIUM_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Quiz
    </div>
let DBTW_MEDIUM_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "medium" } }}
    >
        Quiz
    </Link>
let DBTW_MEDIUM_UNAVAILABLE = 
    <div className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg">
        Quiz
    </div>
let DBTW_HARD_PLAYED =
    <div className="container px-5 py-4 flex flex-col items-center bg-green-500 text-lg">
        Midterm
    </div>
let DBTW_HARD_NOT_PLAYED =
    <Link className="container px-5 py-4 flex flex-col items-center bg-blue-400 text-lg"
        href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "hard" } }}
    >
        Midterm
    </Link>
let DBTW_HARD_UNAVAILABLE =
    <div className="container px-5 py-4 flex flex-col items-center bg-slate-500 text-lg">
        Midterm
    </div>