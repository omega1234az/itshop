export default function CreateAcc() {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex justify-center items-center">
          <div className="w-72 p-5 border border-gray-300 rounded shadow-md">
            <h2 className="text-center mb-5 text-xl font-bold">Create your Account</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="confirm-password" className="block mb-1">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
        <footer className="bg-gray-100 p-3 text-center border-t border-gray-300">
          <div className="flex justify-center gap-4 mb-2">
            <img src="logo.png" alt="logo" className="h-5" />
            <img src="mastercard.png" alt="MasterCard" className="h-5" />
            <img src="kplus.png" alt="K+" className="h-5" />
          </div>
          <div>
            <a href="#" className="mr-3 text-blue-500 hover:underline">Facebook</a>
            <a href="#" className="text-blue-500 hover:underline">Instagram</a>
          </div>
        </footer>
      </div>
    );
  }
  