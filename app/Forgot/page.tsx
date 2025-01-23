import Footer from "../components/Footer";

export default function Forgot(){
    return(
    <div className="flex flex-col min-h-screen">

        <div className="flex-1 flex justify-center items-center">
          <div className="w-[656px] h-auto p-5 border border-gray-300 rounded shadow-md">
            <h2 className="text-center mb-5 text-5xl font-bold">Forgot Password</h2>
            <form>
              <div className="mb-12 text-3xl">
                <label htmlFor="email" className="block mt-10 ml-48">Enter Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
                />
              </div>
              <button
                type="submit"
                className="w-60 p-2 bg-[#0294BDD9] text-black rounded-lg hover:bg-blue-500 ml-48 text-3xl font-bold"
              >
                <a href="/ChangePassword">Confirm</a>
              </button>
            </form>
          </div>
        </div>
        <Footer />
    </div>
    )
}