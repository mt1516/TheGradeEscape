import Link from "next/link";
import Image from "next/image";

export default function Close() {
    return (
        <Link
            className="container h-20 w-40 border-black border-2 rounded-lg justify-self-start flex flex-row justify-center items-center text-black text-3xl"
            href="/">
                Back
        </Link>
    );
}