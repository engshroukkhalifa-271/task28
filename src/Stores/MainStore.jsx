import { createContext, useState } from "react";


export const globalStore = createContext()

const MainStore = ({children}) => {
    const [num, setNum] = useState(2);
    const products = [
    { id: 1, name: "Laptop", price: 25000, category: "Electronics", image: "laptop.jpg" },
    { id: 2, name: "Headphones", price: 1500, category: "Accessories", image: "headphones.jpg" },
    { id: 3, name: "Smartphone", price: 18000, category: "Electronics", image: "smartphone.jpg" },
    { id: 4, name: "Keyboard", price: 1200, category: "Accessories", image: "keyboard.jpg" },
    { id: 5, name: "Mouse", price: 600, category: "Accessories", image: "mouse.jpg" },
    { id: 6, name: "Smart Watch", price: 3500, category: "Wearables", image: "smartwatch.jpg" }
];


    const satHi =() => {
        return <h1>Hi</h1>;
    };

  const value ={
    num : num ,
    setNum,
    satHi,
    products

  }
  return  <globalStore.Provider value={value}>{children}</globalStore.Provider>
  
};

export default MainStore
