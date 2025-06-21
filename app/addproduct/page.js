"use client"; // Bu, yalnızca istemci tarafında çalışacak şekilde formu yapılandırmak için

import { useForm } from "react-hook-form";
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Formu sıfırlamak için
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Form verisini API'ye gönder
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Form verilerini JSON olarak gönder
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Ürün başarıyla eklendi:", result);
        alert("Ürün başarıyla eklendi!");
        reset(); // Formu sıfırla
      } else {
        const error = await response.json();
        console.error("Hata:", error);
        alert(error.message || "Ürün eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Sunucuyla iletişim kurulurken bir hata oluştu.");
    }
  };

  return (
    <div className={styles.productContainer}>
      <h2 className={styles.formTitle}>Ürün Ekle</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Ürün Adı</label>
          <input
            className={styles.formInput}
            type="text"
            id="name"
            {...register("name", { required: "Ürün adı zorunludur" })}
            placeholder="Ürün adı girin"
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Fiyat</label>
          <input
            className={styles.formInput}
            type="number"
            id="price"
            step="0.01"
            {...register("price", { required: "Fiyat zorunludur" })}
            placeholder="Fiyat girin"
          />
          {errors.price && <p className={styles.error}>{errors.price.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Açıklama</label>
          <textarea
            className={styles.formInput}
            id="description"
            {...register("description", { required: "Açıklama zorunludur" })}
            placeholder="Açıklama girin"
          />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Kategori</label>
          <input
            className={styles.formInput}
            type="text"
            id="category"
            {...register("category", { required: "Kategori zorunludur" })}
            placeholder="Kategori girin"
          />
          {errors.category && <p className={styles.error}>{errors.category.message}</p>}
        </div>

        <button type="submit" className={styles.formButton}>
          Ürün Ekle
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
