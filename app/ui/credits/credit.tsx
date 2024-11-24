export default function Credit() {
    return (
        <div className="credits -z-10">
            <div className={`flex flex-col justify-end items-center h-screen text-[#feda4a] text-[500%] font-semibold tracking-[6px] leading-[150%] text-justify animate-[crawl_20s_linear_forwards]`}>
                <div className={`origin-bottom w-[90%]`}>
                    <div className="text-[90%] text-center">
                        <h1 className="uppercase mt-0 mb-[100px] mx-0">
                            Credits
                        </h1>
                        <p className="scroll-text">
                            - Game Idea: Melvin <br />
                            - Artwork: Bosco, online <br />
                            - Sound Effects: online <br />
                            - Front-end: Bosco <br />
                            - Back-end: Bosco, Melvin <br />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}