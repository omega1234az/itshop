import Footer from "../components/Footer";

export default function ManageAcc() {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-4xl p-5">
            <h2 className="text-2xl font-bold mb-5">Account Management</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label htmlFor="name" className="block mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="address" className="block mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Order History</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex justify-between items-center p-3 bg-blue-100 rounded">
                  <div>
                    <p className="text-sm">Order ID: {order}</p>
                    <p className="text-sm">Product Name: Example Product</p>
                    <p className="text-sm">Date: 2025-01-16</p>
                  </div>
                  <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }