 import Cart from "@/components/Cart/Cart";

import { useSession, signOut } from "next-auth/react"

const getProductByCategoryId = async (categoryId) => {
  const response = await fetch(
    `http://localhost:5000/api/products/category/${categoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await response.json();
};

const CategoryProductsPage = async ({ params }) => {

 
 
  
   
 

  const categoryId = (await params).categoryId;
  const products = await getProductByCategoryId(categoryId);
  console.log(products);

  if (!products?.length) return <p>{categoryId} ürün bulunamadı.</p>;

  return (
    <div className="container" style={{padding:"40px 0px"}} >

  
    <table>
      <tbody>
        <tr  >
          {products?.map((item) => (
            <td key={item?.id} style={{ padding: "10px" }}>
              <Cart
                image="/sekerler.png"
                category={item?.category}
                title={item?.name}
                description={item?.description}
                price={item?.price}
                
               

              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>

    </div>
  );
};

export default CategoryProductsPage;
