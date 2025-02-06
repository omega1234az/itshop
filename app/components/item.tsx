import Link from 'next/link'
interface ItemProps {
    id: number;
    name: string;
    price: number;
}

export default function Item({id, name, price }: ItemProps) {
    return <>
        <div className="w-full text-center ">
            <Link href={"/productdetail/"+(id)}>
              <div className="shadow-lg  w-full mx-auto mt-2">
                <img src="/cpu1.jpg" alt="" className="w-48 object-cover mx-auto" />
                <p>{name}</p>
                <p>ราคา {price.toLocaleString()} บาท</p>
              </div>
              </Link>
            </div>
            
    </>
}