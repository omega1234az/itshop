import Footer from "../components/Footer";

export default function Forgot(){
    return(
    <div className="flex flex-col min-h-screen">

        <div className="flex-1 flex justify-center items-center">
          <div className="w-[656px] h-auto p-5 border border-gray-300 rounded shadow-md">
            <h2 className="text-center mb-5 text-5xl font-bold">Change Your Password</h2>
            <form>
              <div className="mb-12 text-3xl">
                <label htmlFor="email" className="block mt-10 text-start">New Password</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
                />
              </div>
              <div className="mb-12 text-3xl">
                <label htmlFor="email" className="block mt-10 text-start">Confirm New Password</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
                />
              </div>
              <button
                type="submit"
                className="w-60 p-2  text-black rounded-lg bg-teal-400 hover:bg-teal-500 text-3xl font-bold ml-48"
              >
                <a href="/login">Confirm</a>
              </button>
            </form>
          </div>
        </div>
        <Footer />
    </div>
    )
}