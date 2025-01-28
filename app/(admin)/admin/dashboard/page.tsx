export default function OTPemail(){
    return(
    <div className="flex flex-col">

        <div className="flex-1 flex justify-center items-center mt-20">
          <div className="w-[500px] h-auto p-5 border border-gray-300 rounded shadow-md bg-gray-300">
            <h2 className="text-center mb-5 text-4xl font-bold">Enter OTP</h2>
            <form>
                <div className="flex justify-center space-x-4 mt-10 mb-10">
                    <input
                        type="text"
                        maxLength={1}
                        className="w-16 h-16 text-center border-2 border-gray-300 rounded-lg text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 ease-in-out bg-gray-600 text-white"
                        id="otp5"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        maxLength={1}
                        className="w-16 h-16 text-center border-2 border-gray-300 rounded-lg text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 ease-in-out bg-gray-600 text-white"
                        id="otp5"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        maxLength={1}
                        className="w-16 h-16 text-center border-2 border-gray-300 rounded-lg text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 ease-in-out bg-gray-600 text-white"
                        id="otp5"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        maxLength={1}
                        className="w-16 h-16 text-center border-2 border-gray-300 rounded-lg text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 ease-in-out bg-gray-600 text-white"
                        id="otp5"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        maxLength={1}
                        className="w-16 h-16 text-center border-2 border-gray-300 rounded-lg text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 ease-in-out bg-gray-600 text-white"
                        id="otp5"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        maxLength={1}
                        className="w-16 h-16 text-center border-2 border-gray-300 rounded-lg text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 ease-in-out bg-gray-600 text-white"
                        id="otp5"
                        autoComplete="off"
                    />
                </div>
              <button
                type="submit"
                className="w-60 p-2 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] text-3xl font-bold ml-[108px] border-solid border-2 border-[#0294BD5C]"
              >
                <a href="/ChangePassword">Confirm</a>
              </button>
            </form>
          </div>
        </div>
    </div>
    )
}
