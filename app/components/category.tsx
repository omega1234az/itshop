import Link from 'next/link'
interface ItemProps {
    id: number;
    name: string;
    img: string;
}

export default function Category({ name, img ,id}: ItemProps) {
    return <>
        <button className="bg-gray-400 hover:bg-gray-500 w-full justify-items-center rounded-lg  h-36">
        <Link href={"/productlist/"+id}>
                <img src={img} alt="" className="h-16  object-cover mx-auto" />
                <p className="mt-2 text-center">{name}</p>
                </Link>
              </button>
    </>
}