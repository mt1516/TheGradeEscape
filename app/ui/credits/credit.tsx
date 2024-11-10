export default function Credit(props: { 
    creditTimeout: number 
}) {
    return (
        <div className="credits">
            <div className={`flex flex-col justify-end items-center h-screen text-[#feda4a] text-[500%] font-semibold tracking-[6px] leading-[150%] text-justify animate-[crawl_${props.creditTimeout}s_linear_forwards]`}>
                <div className={`origin-bottom w-[90%]`}>
                    <div className="text-[90%] text-center">
                        <h1 className="uppercase mt-0 mb-[100px] mx-0">
                            Credits
                        </h1>
                        <p className="scroll-text">
                            - Game Design: Your Name <br />
                            - Development: Your Name <br />
                            - Artwork: Your Name <br />
                            - Music: Your Name <br />
                            - Special Thanks: Your Friends and Family <br />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}