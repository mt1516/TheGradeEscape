import { getCurrentGrade, getCurrentScore } from "@/app/game/storage";

export default function Progress() {
    const currentGrade = getCurrentGrade();
    const currentScore = getCurrentScore();
    const getBackgroundColor = (grade: string) => {
        switch (grade) {
            case 'A+':
            case 'A':
            case 'A-':
                return 'bg-[rgba(145,255,174,0.8)]'
            case 'B+':
            case 'B':
            case 'B-':
                return 'bg-[rgba(255,255,174,0.5)]'
            case 'C+':
            case 'C':
            case 'C-':
                return 'bg-[rgba(255,174,174,0.8)]'
            case 'D':
                return 'bg-[rgba(255,174,174,0.8)]'
            default:
                return 'bg-[rgba(255,100,98,0.7)]'
        }
    };
    const bgColor = getBackgroundColor(currentGrade);
    return (
        <div className={`absolute top-[10%] right-[8%] w-[10%] h-fit my-auto container ${bgColor} rounded-full flex flex-row justify-center items-center`}>
            <div className=" text-black text-xl w-full h-full text-center">
                Grade: {currentGrade} <br />
                Score: {currentScore}
            </div>
        </div >
    );
}