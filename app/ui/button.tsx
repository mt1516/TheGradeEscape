import Link from "next/link";

export default function Close() {
    return (
        <div className="container h-1/2 w-1/12 border-black border-2 rounded-lg flex flex-row justify-center items-center">
            <Link
                className=" text-black text-3xl w-full h-full text-center"
                href="/">
                Back
            </Link>
        </div>
    );
}