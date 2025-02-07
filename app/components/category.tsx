import Link from 'next/link';

interface ItemProps {
  id: number;
  name: string;
  img: string;
}

export default function Category({ name, img, id }: ItemProps) {
  return (
    <Link href={`/productlist/${id}`} className="block">
      <button className="bg-gray-400 hover:bg-gray-500 w-full rounded-lg h-fit flex flex-col items-center justify-center p-4
        transition-transform duration-300 ease-in-out hover:scale-105 hover:translate-y-[-5px]">
        <img src={img} alt="" className="h-16 object-cover" />
        <p className="mt-2 text-center text-sm font-medium truncate w-full max-w-[90%]">
          {name}
        </p>
      </button>
    </Link>
  );
}
