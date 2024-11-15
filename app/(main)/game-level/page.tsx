"use client";

import Link from "next/link"

export default function Page() {
    return (
        <div className='flex flex-row justify-center items-center h-screen'>
            <div className="bg-gray-50 rounded-lg shadow-lg w-8/12 h-4/6">
                <h1 className="text-7xl font-bold text-center my-8 text-black">Course Syllabus</h1>
                <div className="flex flex-col w-fit h-full flex-wrap">
                    <div className="grid grid-rows-3 gap-5 h-4/6 w-fit items-center justify-self-start">
                        <div className="container px-4 py-3 text-black text-wrap w-fit justify-self-start">
                            Don't Take Wrong Steps
                        </div>
                        <div className="container px-4 py-3 text-black text-wrap w-fit justify-self-start">
                            Dancing in the Dark
                        </div>
                        <div className="container px-4 py-3 text-black text-wrap w-fit justify-self-start">
                            Don't Bump the Wall
                        </div>
                    </div>
                    <div className="grid grid-rows-3 gap-5 h-4/6 w-fit justify-self-center">
                        <div className="grid grid-cols-3 gap-4 mx-4 w-11/12 justify-self-center">
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                    href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "easy" } }}
                                >
                                    Assignment
                                </Link>
                            </div>
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "medium" } }}
                                >
                                    Quiz
                                </Link>
                            </div>
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DTWS", difficulty: "hard" } }}
                                >
                                    Midterm
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mx-4 w-11/12 justify-self-center">
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "easy" } }}
                                >
                                    Assignment
                                </Link>
                            </div>
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "medium" } }}
                                >
                                    Quiz
                                </Link>
                            </div>
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DITD", difficulty: "hard" } }}
                                >
                                    Midterm
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mx-4 w-11/12 justify-self-center">
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "easy" } }}
                                >
                                    Assignment
                                </Link>
                            </div>
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
                                href={{ pathname: "/game-level/game", query: { mode: "DBTW", difficulty: "medium" } }}
                                >
                                    Quiz
                                </Link>
                            </div>
                            <div className="container flex flex-col justify-center items-center">
                                <Link className="container px-6 py-4 flex flex-col items-center bg-slate-500"
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
            </div>
        </div>
    );
}