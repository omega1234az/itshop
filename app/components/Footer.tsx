export default function Footer() {
  return (
    <footer className="bg-[#0000004D] p-3 h-[150px] border border-gray-300 flex flex-row justify-between">
      <div className="flex gap-4 mb-2 ml-10 mt-5">
        <img src="logo.jpg" alt="logo" className="h-[68px] w-[96px]" />
        <h2 className="text-2xl text-[#F5F5F5]">ชำระด้วย</h2>
        <img src="mastercard.jpg" alt="MasterCard" className="h-[40px] w-[40px]" />
        <img src="kplus.jpg" alt="K+" className="h-[40px] w-[40px]" />
      </div>
      <div className="flex flex-row justify-between mr-10 mt-5">
        <h1 className="text-2xl text-[#F5F5F5]">เชื่อมต่อกับเรา</h1>
        <a href="#" className="ml-10">
          <img src="Facebook.jpg" alt="facebook" className="h-[40px] w-[40px]" />
        </a>
        <a href="#" className="ml-10">
          <img src="ig.jpg" alt="instagram" className="h-[40px] w-[40px]" />
        </a>
      </div>
    </footer>
  );
}