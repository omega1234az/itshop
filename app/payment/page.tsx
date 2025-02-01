export default function Payment() {
    return(
        <>
            <div className="flex flex-col">
                <div className="flex-1 flex flex-row justify-between mx-auto mt-10">
                    <div className="p-5 w-[850px] h-[650px] bg-gray-300">
                        <h1 className="text-4xl font-bold mb-20"> Thank your for buying with us! </h1>
                        <div className="flex">
                            <div className="mr-auto"> 
                                <h1 className="text-3xl font-bold mb-10"> Order Detail: </h1>
                                <div className="flex mb-5 mt-5 text-2xl">
                                    <h1> Order No:</h1>
                                    <h2> 123</h2>
                                </div>
                                <div className="flex mb-5 text-2xl">
                                    <h1> Order Date:</h1>
                                    <h2> 12/02/2568</h2>
                                </div>
                                <div className="flex mb-5 text-2xl">
                                    <h1> Order: </h1>
                                    <h2> Not confirm</h2>
                                </div>
                                <div className="flex mb-5 text-2xl">
                                    <h1 className="font-bold"> Shipping:</h1>
                                    <h2> 3-5 Day</h2>
                                </div>
                                <div className="flex mb-5 text-2xl">
                                    <h1 className="font-bold"> Payment:</h1>
                                    <h2> Not confirm </h2>
                                </div>
                            </div>
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold "> Deliver </h1>
                                <div className="flex mb-36 mt-5 text-2xl">
                                    <h1> UP delivery</h1>
                                    <button className=" bg-teal-400 hover:bg-teal-500 rounded-lg p-1 ml-20 font-bold"> Change </button>
                                </div>
                                <div className="mb-3 text-2xl">
                                    <h1> Need help ?</h1>
                                    <button className=" text-blue-400"> Contact us</button>
                                </div>
                            </div>

                        </div>
                        <div className="flex mt-10">
                            <label htmlFor="Number" className="block"> Number </label>
                            <input 
                                type="text"
                                id="Number"
                                name="Number"
                                className=" ml-3 w-48 p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                            />
                            
                            <label htmlFor="Number" className="block ml-10"> CVV </label>
                            <input 
                                type="text"
                                id="Number"
                                name="Number"
                                className=" ml-3 mr-auto w-20 p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                            />
                            <button
                            type="submit"
                            className="bg-teal-400 hover:bg-teal-500 rounded-lg p-3 mr-10 font-bold text-black">
                                Checkout 
                            </button>
                        </div>
                    </div>
                    <div className="ml-36 p-5 w-[500px] h-[600px] bg-gray-300">
                        <h1 className="font-bold text-3xl">Check Out:</h1>
                        <div>
                            Item list
                        </div>
                        <div className="flex mt-60 mb-5">
                            <h1 className="text-2xl font-bold mr-auto">Subtotal</h1>
                            <h1> 35$</h1>
                        </div>
                        <div className="flex mb-20">
                            <h1 className="text-2xl font-bold mr-auto"> Shipping</h1>
                            <h1> 35$</h1>
                        </div>
                        <div className="flex">
                            <h1 className="text-2xl font-bold mr-auto">Total</h1>
                            <h1> 37$</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
        
}
