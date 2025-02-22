export default function Success() {
    return (
      <div className="flex justify-center items-center  bg-green-50 h-[850px]">
        <div className="text-center p-10 bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500 animate-bounce"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.293 10.293a1 1 0 0 1 1.414 0L12 12.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-4xl font-semibold text-green-600 mb-4">
            ชำระเงินสำเร็จ
          </div>
          <p className="text-lg text-gray-600">
            การชำระเงินของคุณได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการ!
          </p>
          <div className="mt-8">
            <a
             href="/"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105"
            >
              กลับไปที่หน้าแรก
            </a>
          </div>
        </div>
      </div>
    );
  }
  