export default function login() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[500px] h-[500px] p-5 border-2 border-gray-300 rounded shadow-md mt-10 bg-gray-300">
          <h2 className="text-center mb-5 text-4xl font-bold">Login To your Account</h2>
          <form>
            <div className="mb-12 text-2xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px] bg-gray-600 text-gray-200"
              />
            </div>
            <div className="mb-12 text-2xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px] bg-gray-600 text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-60 p-2 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] ml-28 text-2xl font-bold border-solid border-2 border-[#0294BD5C]"
            >
              <a href="/">Login</a>
            </button>
          </form>
          <div className="flex justify-between mt-14 text-sm">
            <a href="/Forgot" className="text-blue-500 hover:underline">Forgot Password?</a>
            <a href="/CreateAcc" className="text-blue-500 hover:underline">Create Account?</a>
          </div>
        </div>
      </div>
    </div>
  );
}