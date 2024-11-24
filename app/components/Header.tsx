export default function Header() {
    return <>
        <div className="mx-5 grid grid-cols-10 text-center items-center gap-5">
            <div className="bg-red-400 p-5">Logo</div>
            <div className="font-bold">ติดต่อ</div>
            <input className="border border-black col-span-5 p-2 rounded-lg" placeholder="ค้นหา"></input>
            
                <img src="/icon/search.png" alt="searth" className="cursor-pointer" />
                <img src="/icon/bell.png" alt="searth" className="cursor-pointer mx-auto" />
            
            <button className="bg-[#0294BD] p-2">Login</button>
        </div>
    </>
}