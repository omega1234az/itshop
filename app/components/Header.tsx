import Link from 'next/link'
export default function Header() {
    return <>
        <div className="mx-auto container grid grid-cols-10 text-center items-center gap-5">
            <Link href="/" className="bg-red-400 p-5">Logo</Link>
            <Link href="/contact" className="font-bold">ติดต่อ</Link>
            <input className="border border-black col-span-5 p-2 rounded-lg" placeholder="ค้นหา"></input>
            
                <img src="/icon/search.png" alt="searth" className="cursor-pointer" />
                <img src="/icon/bell.png" alt="searth" className="cursor-pointer mx-auto" />
            
                <Link className="bg-[#0294BD] p-2 rounded-lg" href="/login">Login</Link>
            
        </div>
    </>
}