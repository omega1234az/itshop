export default function Forgot(){
    return(
    <div className="flex flex-col">

        <div className="flex-1 flex justify-center items-center mt-20">
          <div className="w-[500px] h-auto p-5 border border-gray-300 rounded shadow-md bg-gray-300">
            <h2 className="text-center mb-5 text-4xl font-bold">Forgot Password</h2>
            <form>
              <div className="mb-12 text-2xl">
                <label htmlFor="email" className="block mt-10">Enter Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg h-[53px] bg-gray-600 text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-60 p-2  text-black rounded-lg bg-teal-400 hover:bg-teal-500 text-3xl font-bold ml-[108px]"
              >
                <a href="/OTPemail">Confirm</a>
              </button>
            </form>
          </div>
        </div>
    </div>
    )
}