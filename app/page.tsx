import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="container  mx-auto">
      <div className="border-b-2 border-black mt-5"></div>
  <div className="h-5 w-full grid grid-cols-5 gap-4 justify-items-stretch mt-8 font-bold">
    <button className="bg-[#0294BD5C] p-2 w-48 ">Tranding Product</button>
    <button className="bg-[#0294BD5C] p-2 w-48">Spacial offers</button>
    <button className="bg-[#0294BD5C] p-2 w-48">PC</button>
    <button className="bg-[#0294BD5C] p-2 w-48">Ram</button>
    <button className="bg-[#0294BD5C] p-2 w-48">VGA</button>
  </div>
</div>
    </>
  );
}
