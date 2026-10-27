import { globalStore } from "../Stores/MainStore"
import { useContext } from "react"



const Button = ({children}) => {

  const {setNum} = useContext(globalStore)
  return (
    <button  onClick={()=> {
       setNum( (prv) => prv + 1 );
    }} 
      className='py-2 px-5 text-xl rounded-lg bg-indigo-500  disabled:bg-gray-300 font-bold cursor-pointer disabled:cursor-not-allowed'>
      {children}
    </button>

  )
}

export default Button
