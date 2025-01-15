import Image from "next/image";

export default function Home() {
  return (
    <>

      <div className="container mx-auto">
        <div className="border-b-2 border-black mt-5"></div>

        <div className="h-5 w-full grid grid-cols-5 gap-4 justify-items-stretch mt-8 font-bold">
          <button className="bg-[#0294BD5C] p-2 w-full rounded-lg">Trending Product</button>
          <button className="bg-[#0294BD5C] p-2 w-full rounded-lg ">Special Offers</button>
          <button className="bg-[#0294BD5C] p-2 w-full rounded-lg">PC</button>
          <button className="bg-[#0294BD5C] p-2 w-full rounded-lg">RAM</button>
          <button className="bg-[#0294BD5C] p-2 w-full rounded-lg">VGA</button>
        </div>

        <div className="mt-10">
          <img src="/banner/banner.jpg" alt="" className="h-40 w-full object-cover" />
        </div>

        <div className=" w-full grid grid-cols-7 gap-4 font-bold mt-5">
          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  ">
            <img src="/icon/cpu.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">CPU</p>
          </button>

          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-5 h-32">
            <img src="/icon/mainboard.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">Mainboard</p>
          </button>
          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-5 h-32">
            <img src="/icon/ram.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">Ram</p>
          </button>
          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-5 h-32">
            <img src="/icon/vga.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">VGA</p>
          </button>
          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-5 h-32">
            <img src="/icon/ssd.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">SSD</p>
          </button>
          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  ">
            <img src="/icon/ssd.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">Case</p>
          </button>
          <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  ">
            <img src="/icon/ssd.png" alt="" className="h-16 w-16 object-cover mx-auto" />
            <p className="mt-2 text-center">...</p>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-5">
          <div className="col-span-2 gap-y-2 grid grid-cols-1">
            <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">Special Offers</p>

            </button>
            <div className="w-full text-center ">
              <div className="shadow-xl w-[70%] mx-auto mt-2">
                <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                <p>ราคา 5000 บาท</p>
              </div>

            </div>
            <div className="w-full text-center ">
              <div className="shadow-lg  w-[70%] mx-auto mt-2">
                <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                <p>ราคา 5000 บาท</p>
              </div>

            </div>
            <div className="w-full text-center ">
              <div className="shadow-lg  w-[70%] mx-auto mt-2">
                <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                <p>ราคา 5000 บาท</p>
              </div>

            </div>
          </div>
          <div className="col-span-5">

            <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">Trending product</p>

            </button>
            <div className="grid grid-cols-4 gap-y-2">
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>

            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg p-3 col-span-3 mt-3">
                <p className=" text-center font-bold w-full text-lg">Top Catagory</p>
              </button>
              <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  h-36">
                <img src="/icon/mainboard.png" alt="" className="h-16  object-cover mx-auto" />
                <p className="mt-2 text-center">Mainboard</p>
              </button>
              <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  h-36">
                <img src="/icon/mainboard.png" alt="" className="h-16  object-cover mx-auto" />
                <p className="mt-2 text-center">Mainboard</p>
              </button>
              <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  h-36">
                <img src="/icon/mainboard.png" alt="" className="h-16  object-cover mx-auto" />
                <p className="mt-2 text-center">Mainboard</p>
              </button>


            </div>

          </div>
        </div>
        <div className="grid grid-cols-6">
          <button className="col-span-6 bg-[#0294BD5C] w-full justify-items-center rounded-lg p-3 col-span-3 mt-3">
            <p className=" text-center font-bold w-full text-lg">More Items</p>
          </button>
          <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <div className="w-full text-center ">
                <div className="shadow-lg  w-[70%] mx-auto mt-2">
                  <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                  <p>CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                  <p>ราคา 5000 บาท</p>
                </div>

              </div>
              <button className="col-span-6 bg-[#0294BDD9] w-fit mx-auto  justify-items-center rounded-lg p-3  mt-3">
            <p className=" text-center font-bold w-48 text-lg">More</p>
          </button>
        </div>

      </div>




    </>
  );
}
