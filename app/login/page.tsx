export default function login() {
  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex-1 flex justify-center items-center">
        <div className="w-[656px] h-auto p-5 border border-gray-300 rounded shadow-md">
          <h2 className="text-center mb-5 text-5xl font-bold">Login To your Account</h2>
          <form>
            <div className="mb-12 text-3xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
              />
            </div>
            <div className="mb-12 text-3xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
              />
            </div>
            <button
              type="submit"
              className="w-60 p-2 bg-[#0294BDD9] text-black rounded-lg hover:bg-blue-500 ml-48 text-3xl font-bold"
            >
              <a href="/">Login</a>
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <a href="/Forgot" className="text-blue-500 hover:underline">Forgot Password?</a>
            <a href="/CreateAcc" className="text-blue-500 hover:underline">Create Account?</a>
          </div>
        </div>
      </div>

      <footer className="bg-[#0000004D] p-3 h-[150px] border border-gray-300 flex flex-row justify-between">
        <div className="flex  gap-4 mb-2 ml-10 mt-5">
          <img src="../logo.jpg" alt="logo" className="h-[68px] w-[96px]" />
          <h2 className="text-2xl text-[#F5F5F5]">ชำระด้วย</h2>
          <img src="../mastercard.jpg" alt="MasterCard" className="h-[40px] w-[40px]" />
          <img src="../kplus.jpg" alt="K+" className="h-[40px] w-[40px]" />
        </div>
        <div className="flex flex-row justify-between mr-10 mt-5">
        <h1 className="text-2xl text-[#F5F5F5]">เชื่อมต่อกับเรา</h1>
          <a href="#" className="ml-10">
            <img src="../Facebook.jpg" alt="facebook" className="h-[40px] w-[40px]"/>
          </a>
          <a href="#" className="ml-10">
            <img src="../ig.jpg" alt="instagram" className="h-[40px] w-[40px]"/>
          </a>
        </div>
      </footer>
    </div>
  );
}