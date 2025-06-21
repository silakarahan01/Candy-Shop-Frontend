"use client"; // This ensures that this component is client-side only

import { useSession, signIn } from "next-auth/react"
 
import { useForm } from "react-hook-form";
import Link from "next/link";
import styles from '../register/Auth.module.css';
import { useRouter } from 'next/navigation'; // Use next/navigation for routing
import { useEffect, useState } from 'react'; // To handle conditional rendering

const Login = () => {
  const { data: session, status } = useSession()
  console.log(session)
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const [mounted, setMounted] = useState(false); // Track if component is mounted
  const router = useRouter();

  useEffect(() => {
    // Once the component is mounted, set mounted to true
    setMounted(true);
  }, []);

  useEffect(() => {
      if(session) {
        router.push("/");
      }
  },[session])

  const onSubmit = async (data) => {
    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false
      })
      if (response.error) {
        alert(response.error)
      }
    } catch(err) {
      console.log("err", err)
    }

    
  };

  // Only render the component after it has mounted
  if (!mounted) {
    return null; // Avoid rendering until the component has mounted
  }

  // If the user is logged in, hide the login form
 

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.formtitle}>Giriş Yap</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            className={styles.forminput}
            type="username"
            id="username"
            {...register("username", { required: "Kullanıcı Adı Zorunlu" })}
            placeholder="Kullanıcı Adı Girin"
          />
          {errors.username && <p className={styles.error}>{errors.username.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Şifre</label>
          <input
            className={styles.forminput}
            type="password"
            id="password"
            {...register("password", { required: "Şifre zorunlu" })}
            placeholder="Şifrenizi girin"
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <button type="submit" className={styles.formbutton}>
          Giriş Yap
        </button>
        <div style={{background:"green",color:"white",padding:"10px", textAlign:"center",marginTop:"10px"}}>  <Link href="/register">Kayıt Ol</Link></div>
       
      </form>
    </div>
  );
};

export default Login;
