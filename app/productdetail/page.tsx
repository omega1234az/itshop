import Image from "next/image";
import Footer from "../components/Footer";
import Category from "../components/category";
import Item from "../components/item";

export default function ProductDetail() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 flex flex-row  justify-center container mt-10">
          <div className="ml-48 mr-auto">
          <img src="/cpu1.jpg" alt="" className="w-72 object-cover mx-auto border-1 border-gray-300 shadow-lg rounded-lg" />
          </div>
          <div className=" mr-96">
            <h1 className="font-bold text-4xl mb-5"> ชื่อเครื่อง</h1>
            <h1 className="text-xl font-semibold text-gray-700">
              Product Description:
            </h1>
            <div className="w-96 h-48 mt-5 p-3 border-2 border-gray-300 rounded-lg shadow-md">
              <h1 className="text-base break-words"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, vel at ut quia repellat ipsam sed, enim similique ex dolorem laudantium incidunt recusandae ipsum sequi dicta amet quam neque animi.</h1>
            </div>
            <div>
              <h1 className="mt-5 font-bold text-2xl"> 199$</h1>
            </div>
            <button
            type="submit"
            className="mt-3 bg-teal-400 hover:bg-teal-500 p-2 rounded-lg font-semibold">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="ml-48 mt-20">
          <h1 className="font-semibold text-3xl"> สเป็กเครื่อง </h1>
        </div>
      </div>
    </>
  );
}
