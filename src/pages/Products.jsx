
import { useContext } from "react";
import { Link } from "react-router";
import { globalStore } from "../Stores/MainStore";

const Products = () => {
    const { products } = useContext(globalStore);

    return (
        <div>
            <h1 className="text-3xl font-bold text-sky-700 text-center my-10">
                Products
            </h1>

            <div className="container mx-auto grid grid-cols-3 gap-5">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/products/single-product/${product.id}`}
                        className="product shadow-2xl p-5 rounded-lg flex flex-col items-center mt-5 gap-3"
                    >
                        <h3 className="text-7xl font-extrabold">
                            {product.id}
                        </h3>

                        <p className="text-xl text-gray-500 font-bold">
                            {product.name}
                        </p>

                        <p>{product.price} EGP</p>

                        <p>{product.category}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Products;
