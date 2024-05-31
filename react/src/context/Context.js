import { createContext, useState } from "react";
export const AppContext = createContext(null);

export default function ContextProvider(props){
  const [counter,setCounter] = useState(99);
  const [shop_ar,setShopAr] = useState([
    {name:"milk",amount:4,id:1},
    {name:"bamba",amount:2,id:2},
    {name:"shoko",amount:6,id:3},
  ]);

  const addProduct = (newItem) => {
    setShopAr([...shop_ar,newItem]);
  }

  const resetAllProducts = () => {
    setShopAr([]);
  }

  const deleteProduct = (del_id) => {
    const filter_ar = shop_ar.filter(item => item.id != del_id)
    setShopAr(filter_ar);
  }

  const globalValue = {
    counter,setCounter,
    shop_ar,addProduct,resetAllProducts,deleteProduct
  }
    // Value - כל מה שיהיה מהמאפיין שנעביר לווליו
  // יהפוך להיות גלובלי לכל הקומפנינטת ש
  // APPCONTEXT PROVIDER עוטף
  return (
    <AppContext.Provider value={globalValue} >
      {props.children}
    </AppContext.Provider>
  )
}