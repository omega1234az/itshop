import Link from 'next/link'
interface ItemProps {
    name: string;
    img: string;
}

export default function Category({ name, img }: ItemProps) {
    return <>
        <button className="bg-[#0294BD5C] w-full justify-items-center rounded-lg  h-36">
        <Link href={"/productlist"}>
                <img src={"/icon/"+img} alt="" className="h-16  object-cover mx-auto" />
                <p className="mt-2 text-center">{name}</p>
                </Link>
              </button>
    </>
}