import Image from "next/image";

export default function ProductDetail() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-4">
        <div className="flex items-center">
          <div className="text-lg font-bold">logo</div>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="ค้นหา"
            className="border px-4 py-2 rounded-lg"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="flex justify-center">
          <Image
            src="/cpu1.jpg"
            alt="Intel Core i7"
            width={300}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold mb-4">ชื่อเครื่อง</h1>
          <p className="bg-gray-200 p-4 rounded mb-4">คำอธิบายเครื่อง</p>
          <p className="text-xl text-blue-500 font-bold mb-4">199$</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
            <span>Add to Cart</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.879 3.515a2.25 2.25 0 002.121 1.735h8.12a2.25 2.25 0 002.121-1.735L19 3M3 3h18m-7.5 14.25a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 11-4.5 0m-4.5 0H19.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 flex justify-between items-center">
        <div>logo</div>
        <div className="flex space-x-4">
          <div>จ่ายด้วย</div>
          <div className="text-lg font-bold">MasterCard</div>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-500">
            Facebook
          </a>
          <a href="#" className="text-blue-500">
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
