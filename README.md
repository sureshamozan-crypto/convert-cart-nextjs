---

## 🏗️ System Architecture Overview

The **Convert Cart System** is designed using a **microservices architecture** for scalability, modularity, and independent deployment.  
Each service handles a specific domain — from product data ingestion to UI visualization and dynamic filtering.

---

### 🧩 1. Product Service (Node.js + Express + MongoDB Atlas)

The **Product Service** acts as the data ingestion and management layer.

#### 🔹 Core Responsibilities:
- 🔄 **Integrates with WooCommerce’s REST API** to import and sync product data  
- 📦 **Ingests and stores product details** (title, category, price, tags, stock status) into **MongoDB Atlas**  
- 🧾 **Provides RESTful endpoints** for product listing, pagination, and sorting  
- 💾 **Maintains a local cache** of WooCommerce products for faster access  

#### 🔹 Example API Endpoints:
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/products` | `GET` | Fetch all products with pagination and filters |
| `/api/products/:id` | `GET` | Get product by ID |
| `/api/products/sync` | `POST` | Sync and update data from WooCommerce |

#### 🧠 Sample Flow:
1. Connect to **WooCommerce REST API** using API credentials  
2. Fetch product list and transform it into a local data structure  
3. Insert or update products in **MongoDB Atlas**  
4. Serve data to frontend and other microservices  

---

### 🧠 2. Segment Service (Node.js + Express)

The **Segment Service** handles filtering, segmentation, and advanced querying logic.  

#### 🔹 Core Responsibilities:
- ⚙️ **Filters products** based on multiple dynamic criteria (category, price, tags, sale status, etc.)  
- 🧩 **Processes rules** defined in a simple **text-based rule editor**  
- 🧮 **Returns filtered datasets** to the Next.js frontend  
- 🔌 **Integrates seamlessly with Product Service API** for real-time data  

#### 🔹 Example API Endpoints:
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/segments` | `GET` | Apply filters and return matching products |

![Filter UI Example](https://github.com/sureshamozan-crypto/convert-cart-nextjs/blob/e65c4eb4c6505e1b0533c64bf8c66f3834604d4b/ou-1.png)

#### 🧠 Example Rule JSON:
```json
{
  "filters": {
    "category": "Drinks",
    "price": { "$lt": 50 },
    "stock_status": "instock"
  }
}
