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
                            course 1 (DBTW)
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
                            course 2 (DITD)
                        </div>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: {
                                    mode: "DITD",
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
                                    mode: "DITD",
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
                                    mode: "DITD",
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
                            course 3 (DTWS)
                        </div>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { 
                                    mode: "DTWS",
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
                                    mode: "DTWS",
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
                                    mode: "DTWS",
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
                            Final Exam
                        </div>
                        <Link
                            href={{
                                pathname: "/game-level/game",
                                query: { 
                                    mode: "Final",
                                    difficulty: "hard"
                                }
                            }}
                        >
                            Exam
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}