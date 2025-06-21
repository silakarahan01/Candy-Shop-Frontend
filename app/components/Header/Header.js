"use client";  // Bu direktif, bileşenin sadece istemci tarafında çalışmasını sağlar

import { useSession, signOut } from "next-auth/react"

import Link from "next/link";
import { FaShoppingCart } from 'react-icons/fa';  // Font Awesome'dan sepet ikonu
import styles from "./Header.module.css";
import { useRouter } from "next/navigation"; // useRouter hook'u
const Header = () => {
    const { data: session, status } = useSession()
    console.log(session)

    const router = useRouter(); // useRouter hook'unu kullanıyoruz

  return (
    <header className={styles.header}>
      <div className="container">
      <div className="marquee1">
      <p>Tatlı Anlar, Şekerli Mutluluklar!</p>
    </div>
        <h1 style={{textAlign:"center",marginBottom:"50px"
        }}>Online Şeker & Çikolata Dünyası
        </h1>
        <div className={styles.headerflex}>
          <div className={styles.logo}>
            <Link href="/"><img style={{width:"100px",borderRadius:"50%"}} src="/logo.png" /></Link>
          </div>
         
          <nav className={styles.nav}>
            <ul>
              <li>
                <Link href="/">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/aboutus">Hakkımızda</Link>
              </li>
              <li>
                <Link href="/products">Ürünler</Link>
              </li>
            </ul>
          </nav>
           
          <div className={styles.cart}>
            <Link href="/cart">
              <FaShoppingCart size={24} />
             
            </Link>
            {session ?    <div className={styles.log}><button onClick={signOut}>Cikis Yap</button> </div> : <div className={styles.log}> <Link href="/login">Giriş Yap</Link> </div>}
            
       
            
          </div>

          
        </div>
      </div>
    </header>
  );
};

export default Header;
