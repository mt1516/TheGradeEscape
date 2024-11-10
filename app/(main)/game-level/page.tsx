"use client";

import Link from "next/link"

export default function Page() {
    return (
        <div className="bg-sky-400 w-full h-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Course Syllabus</h1>

            <div className="grid grid-rows-1 gap-4 w-3/6">
                <div>
                    <div className="flex flex-row">
                        <div>
                            course 1
                        </div>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { 
                                    mode: "DBTW",  
                                    difficulty: "easy"
                                }
                            }}
                        >
                            Assignment
                        </Link>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: {
                                    mode: "DBTW",
                                    difficulty: "medium"
                                }
                            }}
                        >
                            Assignment
                        </Link>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { 
                                    mode: "DBTW",
                                    difficulty: "hard"
                                }
                            }}
                        >
                            Assignment
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row">
                        <div>
                            course 2
                        </div>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { id: "3" }
                            }}
                        >
                            Assignment
                        </Link>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { id: "4" }
                            }}
                        >
                            Assignment
                        </Link>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { id: "5" }
                            }}
                        >
                            Assignment
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row">
                        <div>
                            course 3
                        </div>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { id: "6" }
                            }}
                        >
                            Assignment
                        </Link>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { id: "7" }
                            }}
                        >
                            Assignment
                        </Link>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { id: "8" }
                            }}
                        >
                            Assignment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}