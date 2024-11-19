import Link from "next/link";

export default function Close() {
    return (
        <div className="absolute top-[10%] left-[8%] w-1/12 h-fit my-auto container border-black border-2 rounded-lg flex flex-row justify-center items-center">
            <Link
                className=" text-black text-3xl w-full h-full text-center"
                href="/">
                Back
            </Link>
        </div>
    );
}