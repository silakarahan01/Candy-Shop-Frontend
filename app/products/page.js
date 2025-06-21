"use client"; // Bu, yalnızca istemci tarafında çalışacak şekilde formu yapılandırmak için

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";

 import Cart from '../components/Cart/Cart'
import { useSession, signOut } from "next-auth/react"
export default function Home() {
  const { data: session, status } = useSession()
 
  const [data, setData] = useState();
  const [cart, setCart] = useState();
 
  const userId = localStorage.getItem("userId"); // userId'yi localStorage'dan çekiyoruz

  const token = session?.user?.token
  
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json()) // JSON formatında yanıtı çözümle
      .then((data) => setData(data)) // Ürünleri konsola yazdır
      .catch((error) => console.error("Hata:", error)); // Hata durumunda
  }, []);

 

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
  }, []); // cartUpdated değiştiğinde fetchCart tetiklenecek
 
  const handleAddToCart = async (product) => {
    // Sepetteki ürünleri kontrol etmek için mevcut sepeti alıyoruz
    const existingProduct = cart?.products?.find((item) => item.productId === product?._id);
    console.log("existingProduct",existingProduct)
    if (existingProduct) {
      // Eğer ürün sepette varsa, kullanıcıya uyarı veriyoruz
      alert("Bu ürün zaten sepette var!");
      return; // Ürün zaten sepette olduğu için fonksiyonu sonlandırıyoruz
    }
  
    const data = {
      userId: userId,  // Kullanıcı ID'si buradan alınıyor
      productId: product?._id,  // Ürün ID'si
      quantity: 1,  // Sepet miktarı
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token
        },
        body: JSON.stringify(data),  // Sepet verisini JSON olarak gönderiyoruz
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Sepet güncellendi:", result);
        setCart(result.cart); // Sepeti güncellemek için state'i güncelliyoruz
        alert(`Ürün Sepete eklendi!`); // Ürün ekleme mesajını gösteriyoruz
      } else {
        const error = await response.json();
        console.error("Hata:", error);
        alert("Ürünü Sepet Eklemek İçin Lütfen Giriş Yapınız");
      }
    } catch (error) {
      console.error("API çağrısında hata oluştu:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };
  return (
    <>
      <div className="container">
      <h1 style={{textAlign: "center",marginBottom:"50px",textDecoration:"underline",marginTop:"150px"}}>ÜRÜNLER</h1>
      <table>
  <tbody>
    <tr>
      {data?.map((item) => (
        <td key={item?.id} style={{padding:"10px"}}>
          <Cart
            image="/sekerler.png"
            category={item?.category}
            title={item?.name}
            description={item?.description}
            price={item?.price}
            onAddToCart={() => handleAddToCart(item)}
            basket="Sepete Ekle" 
            isActive={true} 
          />
        </td>
      ))}
    </tr>
  </tbody>
      </table>
      </div>
    </>
     
  );
}
