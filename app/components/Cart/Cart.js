import styles from './Cart.module.css';

const Cart = ({ image, title, description, category, price, onAddToCart, basket, isActive }) => {
  return (
    <div className={styles.cart}>
      <img src={image} alt={title} className={styles.image} />
      <p className={styles.category}>Kategori Adı:{category}</p>
      <div className={styles.details}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{price} TL</span>
          {isActive && (
            <button className={styles.button} onClick={onAddToCart}>
              {basket}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
