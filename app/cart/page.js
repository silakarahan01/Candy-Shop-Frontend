'use client'
import { useEffect, useState } from 'react';
import { useSession, signOut } from "next-auth/react"
import Cart from "../components/Cart/Cart";

const Carts = () => {
  
  const [cart, setCart] = useState([]); // Sepet verisi
  const [cartUpdated, setCartUpdated] = useState(false); // Sepet güncellendi durumu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession()
 
    const token = session?.user?.token;

    useEffect(() => {
      const fetchCart = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/cart', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': token, // JWT token'ı header'a ekleyin
            },
          });
    
          if (!response.ok) {
            throw new Error('Sepet verileri alınırken bir hata oluştu');
          }
    
          const data = await response.json();
          setCart(data); // Sepet verisini state'e kaydediyoruz
          setLoading(false); // Yüklenme bitti
        } catch (error) {
          setError(error.message); // Hata mesajını state'e kaydediyoruz
          setLoading(false); // Yüklenme bitti
        }
      };
    
      fetchCart();
    }, [cartUpdated]); // cartUpdated değiştiğinde fetchCart tetiklenecek

 
  const handleDeleteCart = async (product) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'token': token, // JWT token'ı header'a ekleyin
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Sepet güncellendi:", result);
  
        // Sepeti güncellemek için state'i güncelliyoruz
        setCart(result.cart?.products || []); // Sepet ürünlerini güncelle
  
        alert(`ürün sepetten silindi!`); // Ürün silme mesajını gösteriyoruz
  
        // Sepeti güncellediğimizi belirtiyoruz
        setCartUpdated(prev => !prev);  // cartUpdated'yi değiştirerek useEffect'i tetikliyoruz
      }  
    } catch (error) {
      console.error('Hata oluştu:', error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const productDetails = cart?.products?.map(item => item.productId);
 
  return (
    <>

<div className='container' style={{padding:"50px 0px",display:"flex",alignItems:"center",justifyContent:"center"}}>

      
<table>

<tbody>
     
<tr>
      { productDetails?.length > 0 ? productDetails?.map((item) => (
       
     
            
               <td key={item?.id} style={{padding:"10px"}}>
                 <Cart
                   image="/sekerler.png"
                   category={item?.category}
                   title={item?.name}  
                   description={item?.description}
                   price={item?.price}
                   onAddToCart={() => handleDeleteCart(item)}
                   basket="Sepeti Sil" 
                   isActive={true} 
                 />
               </td>
             
        
         
      )) : <h3 style={{textAlign:"center",margin:"300px 0px",fontSize:"40px"}}>SEPETTE ÜRÜN BULUNMAMAKTADIR.</h3>}
    </tr>
</tbody>
             </table>

             </div>
    </>
  );
};

export default Carts;
