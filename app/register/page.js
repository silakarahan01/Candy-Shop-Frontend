"use client"; // Bu, yalnızca istemci tarafında çalışacak şekilde formu yapılandırmak için

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // useRouter hook'u
import styles from '../register/Auth.module.css'

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset, // Formu sıfırlamak için
  } = useForm();
  
  const router = useRouter(); // useRouter hook'unu kullanıyoruz

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      // Form verisini API'ye gönder
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Form verilerini JSON olarak gönder
      });

      // API'den gelen yanıtı işleme
      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully!", result);
        alert(result.message); // Başarı mesajını göster
        
        // Başarılı gönderim sonrası formu sıfırlama
        reset(); 

        // Kullanıcı başarılı bir şekilde kaydedildiyse login sayfasına yönlendir
        if (result.message === "Kullanıcı başarıyla kaydedildi") {
          router.push('/login'); // Login sayfasına yönlendir
        }
      } else {
        const error = await response.json();
        console.error("Error:", error);
        alert(error.message); // Hata mesajını göster
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.formtitle}>Kayıt Ol</h2>
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
          <label htmlFor="email">E-posta</label>
          <input
            className={styles.forminput}
            type="email"
            id="email"
            {...register("email", { required: "E-posta zorunlu" })}
            placeholder="E-posta adresinizi girin"
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Telefon</label>
          <input
            className={styles.forminput}
            type="text"
            id="phone"
            {...register("phone", { required: "Telefon zorunlu" })}
            placeholder="Telefon Numaranızı Girin"
          />
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
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
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;
