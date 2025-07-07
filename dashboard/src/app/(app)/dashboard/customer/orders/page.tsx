'use client';
import { useState, useEffect } from 'react';

interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  products: OrderProduct[];
  orderDate: string;
  status: string;
  totalAmount: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/customer/orders');
        const data = await response.json();
        console.log('API Response:', data);
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container ml-64 p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
          <p className="text-gray-500">You haven&apos;t placed any orders yet. Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.orderId.substring(0, 8)}</h2>
                  <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                  {order.status}
                </span>
              </div>
              <div>
                {order.products.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                    <p className="font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="text-right mt-4">
                <p className="text-lg font-bold">Total: ${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;