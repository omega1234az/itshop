export default function Cancel() {
    return (
      <div className="flex justify-center items-center min-h-[850px] ">
        <div className="text-center p-10 bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500 animate-bounce"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm3-8a1 1 0 011.707-.707l2 2a1 1 0 01-1.414 1.414l-2-2A1 1 0 0113 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-4xl font-semibold text-red-600 mb-4">
            การชำระเงินถูกยกเลิก
          </div>
          <p className="text-lg text-gray-600">
            การชำระเงินของคุณถูกยกเลิก หากมีข้อสงสัยกรุณาติดต่อเรา
          </p>
          <div className="mt-8">
            <button
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105"
            >
              กลับไปที่หน้าแรก
            </button>
          </div>
        </div>
      </div>
    );
  }
  