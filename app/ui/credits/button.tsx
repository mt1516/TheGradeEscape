import Link from "next/link";
import Image from "next/image";

export default function Close() {
    return (
        <div className="z-10">
            <Link
                className="absolute top-2 left-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center focus:outline-none"
                href="/">
                <Image src="/texture/white-cross.svg" alt="Close" width={24} height={24} />
            </Link>
        </div>
    );
}