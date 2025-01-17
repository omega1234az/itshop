import Footer from "../components/Footer";

export default function CreateAcc() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[656] h-[644] p-5 border border-gray-300 rounded shadow-md">
          <h2 className="text-center mb-5 text-5xl font-bold">Create your Account</h2>
          <form>
            <div className="mb-6 text-3xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-6 text-3xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-6 text-3xl">
              <label htmlFor="confirm-password" className="block mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-[250px] p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-3xl font-bold ml-44"
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
