
import "./productlist.css";
import Item from "../components/item";
export default function Productlist() {
  return (
    <div className="App container mx-auto">
      {/* Header */}
      

      {/* Filters */}
      <section className="filters">
        <select>
          <option value="">Category</option>
          <option value="CPU">CPU</option>
          <option value="RAM">RAM</option>
          <option value="GPU">GPU</option>
        </select>
        <input type="number" placeholder="Min Price" />
        <input type="number" placeholder="Max Price" />
        <select>
          <option value="">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </section>

      {/* Product List */}
      <div className="w-full grid grid-cols-5 gap-5">
                <Item name="Amd" price={20} />
                <Item name="Amd" price={20} />
                <Item name="Amd" price={20} />
                <Item name="Amd" price={20} />
                <Item name="Amd" price={20} />
            
      </div>
    </div>
  );
};


