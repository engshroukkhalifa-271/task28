import { useContext } from "react";
import { useParams } from "react-router";
import { globalStore } from "../Stores/MainStore";


const SingleProduct = () => {
    const {productId} = useParams()

    const {products} = useContext(globalStore)

    const product = products.find((product)=> product.id == productId )
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.category}</p>
      <span>{product.price}</span>
    </div>
  );
};

export default SingleProduct;
