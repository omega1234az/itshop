import Footer from "../components/Footer";

export default function Forgot(){
    return(
    <div className="flex flex-col">

        <div className="flex-1 flex justify-center items-center mt-10">
          <div className="w-auto h-[500px] p-5 border border-gray-300 rounded shadow-md bg-gray-300">
            <h2 className="text-center mb-5 text-4xl font-bold">Change Your Password</h2>
            <form>
              <div className="mb-12 text-2xl">
                <label htmlFor="email" className="block mt-10 text-start">New Password</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg h-[53px] text-white bg-gray-600"
                />
              </div>
              <div className="mb-12 text-2xl">
                <label htmlFor="email" className="block mt-10 text-start">Confirm New Password</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg h-[53px] text-white bg-gray-600"
                />
              </div>
              <button
                type="submit"
                className="w-60 p-2 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] text-3xl font-bold ml-[85px] border-solid border-2 border-[#0294BD5C]"
              >
                <a href="/login">Confirm</a>
              </button>
            </form>
          </div>
        </div>
    </div>
    )
}