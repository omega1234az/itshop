import Link from 'next/link';

interface ItemProps {
    id: number;
    name: string;
    price: number;
    img: string;
}

export default function Item({ id, name, price, img }: ItemProps) {
    return (
        <div className="w-full text-center">
            <Link href={`/productdetail/${id}`}>
                <div className="shadow-lg w-full mx-auto mt-2 flex flex-col justify-between p-3 
                    transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
                    <img src={img} alt="" className="w-32 h-32 mx-auto object-contain" />
                    <p className="min-h-[48px] text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                        {name}
                    </p>
                    <p className="font-bold text-red-500">ราคา {price.toLocaleString()} บาท</p>
                </div>
            </Link>
        </div>
    );
}
