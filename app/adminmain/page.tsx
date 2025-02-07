export default function adminmain(){
    return (
        <>
        <div className ="flex flex-col">
            <div className="flex flex-1 flex-row justify-between p-10">
                <div className="flex flex-1 containe flex-col mr-96">
                    <div className=" text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-auto w-max p-2 mb-20">
                        view Product
                    </div>
                    <div className="text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-auto w-max p-2 mb-20">
                        View User
                    </div>
                    <div className="text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-auto w-max p-2 mb-20">
                        View Report
                    </div>
                    <div className="text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-auto w-max p-2 mb-20">
                        View Product Statistics
                    </div>
                    <div className="text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-auto w-max p-2 mb-20">
                        View Check out
                    </div>
                </div>
                <div className="flex container items-center text-center">
                    <div className="text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-max w-96 p-7">
                        Add Product
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}