import Link from 'next/link'
interface ItemProps {
    name: string;
    price: number;
}

export default function Item({ name, price }: ItemProps) {
    return <>
        <div className="w-full text-center ">
              <div className="shadow-lg  w-full mx-auto mt-2">
                <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                <p>{name}</p>
                <p>ราคา {price} บาท</p>
              </div>

            </div>
    </>
}