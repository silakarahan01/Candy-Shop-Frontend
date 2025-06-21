"use client"; // Bu, yalnızca istemci tarafında çalışacak şekilde formu yapılandırmak için

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";

import styles from "./page.module.css";
import Cart from "./components/Cart/Cart";
import { useSession, signOut } from "next-auth/react"
import Link from "next/link";
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

  const categories = [...new Set(data?.map(item => item.category))];
 
  console.log(categories)
  return (
    <>
    
    <>
  <div className="container" style={{ position: "relative" }}>
    <div className="marquee-container">
      <img
        src="/banner.jpg"
        alt="Tatlı görsel"
        className="marquee-image"
      />
    </div>

    <button
      onClick={() => {
        const element = document.getElementById("products");
        element?.scrollIntoView({ behavior: "smooth" });
      }}
      style={{
        display: "block",
        margin: "20px auto",
        padding: "10px 20px",
        backgroundColor: "#ff69b4",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Ürünlere Git
    </button>

    <div
      style={{
        padding: "25px 0px",
        borderBottom: "1px solid #000",
      }}
    >
      <h2 style={{ padding: "0px 0px", textAlign: "center" }}>
        ÜRÜN KATEGORİLERİ
      </h2>
      {categories?.map((item) => (
        <td key={item} style={{ padding: "10px" }}>
          <Link
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
            key={item}
            href={`/products/${item}`}
          >
            {item}
          </Link>
        </td>
      ))}
    </div>

    <section id="products" style={{ backgroundColor: "#ff9bcb38" }}>
    <table className="product-table">
  <tbody>
    {data?.map((item, index) => {
      const isFirstInRow = index % 4 === 0;
      const isLastInRow = (index + 1) % 4 === 0;

      return isFirstInRow ? (
        <tr key={`row-${index}`}>
          <td key={item?.id} className="product-cell">
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
          {data.slice(index + 1, index + 4).map((subItem) => (
            <td key={subItem?.id} className="product-cell">
              <Cart
                image="/sekerler.png"
                category={subItem?.category}
                title={subItem?.name}
                description={subItem?.description}
                price={subItem?.price}
                onAddToCart={() => handleAddToCart(subItem)}
                basket="Sepete Ekle"
                isActive={true}
              />
            </td>
          ))}
        </tr>
      ) : null;
    })}
  </tbody>
</table>

    </section>
  </div>
</>

    </>
     
  );
}
