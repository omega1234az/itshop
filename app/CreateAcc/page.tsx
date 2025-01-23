export default function CreateAcc() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex justify-center items-center mt-10">
        <div className="w-[500px] h-[500px] p-5 border border-gray-300 rounded shadow-md bg-gray-200">
          <h2 className="text-center mb-5 text-4xl font-bold">Create your Account</h2>
          <form>
            <div className="mb-6 text-2xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
              />
            </div>
            <div className="mb-6 text-2xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
              />
            </div>
            <div className="mb-6 text-2xl">
              <label htmlFor="confirm-password" className="block mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-[250px] p-2 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] text-3xl font-bold ml-[108px] border-solid border-2 border-[#0294BD5C]"
            >
              <a href="/login">Confirm</a>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
