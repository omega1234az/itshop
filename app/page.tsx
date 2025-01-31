import Image from "next/image";
import Item from "./components/item";
import Category from "./components/category";
export default function Home() {
  return (
    <>

      <div className="container mx-auto">
        <div className="border-b-2 border-black mt-5"></div>

        <div className="h-5 w-full grid grid-cols-5 gap-4 justify-items-stretch mt-8 font-bold">
          <button className="bg-teal-400 hover:bg-teal-500 p-2 w-full rounded-lg">Trending Product</button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg ">Special Offers</button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">PC</button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">RAM</button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">VGA</button>
        </div>

        <div className="mt-10">
          <img src="/banner/banner.jpg" alt="" className="h-40 w-full object-cover" />
        </div>

        <div className=" w-full grid grid-cols-7 gap-4 font-bold mt-5">
        <Category name="CPU" img="cpu.png"/>
        <Category name="Mainboard" img="mainboard.png"/>
        <Category name="Ram" img="ram.png"/>
        <Category name="SSD" img="ssd.png"/>
        <Category name="Graphic Card (VGA)" img="vga.png"/>
        <Category name="monitor" img="monitor.svg"/>
        <Category name="laptop" img="laptop.png"/>
        
        </div>
        <div className="grid grid-cols-7 gap-4 mt-5">
          <div className="col-span-2 gap-y-2 grid grid-cols-1">
            <button className="bg-teal-400 hover:bg-teal-500 w-full justify-items-center rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">Special Offers</p>

            </button>
            <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />

          </div>
          <div className="col-span-5">

            <button className="bg-teal-400 hover:bg-teal-500 w-full justify-items-center rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">Trending product</p>

            </button>
            <div className="grid grid-cols-4 gap-2">
            <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />

            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <button className="bg-teal-400 hover:bg-teal-500 w-full justify-items-center rounded-lg p-3 col-span-3 mt-3">
                <p className=" text-center font-bold w-full text-lg">Top Catagory</p>
              </button>
              
              <Category name="Mainboard" img="mainboard.png"/>
              <Category name="Mainboard" img="mainboard.png"/>
              <Category name="Mainboard" img="mainboard.png"/>
              

            </div>

          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <button className="col-span-6 bg-teal-400 hover:bg-teal-500 w-full justify-items-center rounded-lg p-3  mt-3">
            <p className=" text-center font-bold w-full text-lg">More Items</p>
          </button>
         
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <Item name="Amd" price={20} />
          <button className="col-span-6 bg-teal-400 hover:bg-teal-500 w-fit mx-auto  justify-items-center rounded-lg p-3  mt-3">
            <p className=" text-center font-bold w-48 text-lg">More</p>
          </button>
        </div>

      </div>




    </>
  );
}
