import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Sample data generator for testing the orders dashboard
export async function seedSampleOrders() {
  try {
    const storeIds = ['store-001', 'store-002', 'store-003'];
    
    const sampleProducts = [
      { name: 'Samsung Galaxy S23', price: 65000, category: 'Electronics' },
      { name: 'Apple iPhone 14', price: 79000, category: 'Electronics' },
      { name: 'Nike Air Max', price: 8500, category: 'Footwear' },
      { name: 'Levi\'s Jeans', price: 3500, category: 'Clothing' },
      { name: 'Organic Rice 5kg', price: 450, category: 'Groceries' },
      { name: 'Laptop Backpack', price: 2500, category: 'Accessories' },
      { name: 'Wireless Headphones', price: 12000, category: 'Electronics' },
      { name: 'Coffee Maker', price: 8500, category: 'Appliances' },
      { name: 'Yoga Mat', price: 1200, category: 'Fitness' },
      { name: 'Protein Powder', price: 3200, category: 'Health' }
    ];

    const sampleCustomers = [
      { name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91-9876543210' },
      { name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91-9876543211' },
      { name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91-9876543212' },
      { name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91-9876543213' },
      { name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91-9876543214' },
      { name: 'Anita Gupta', email: 'anita.gupta@email.com', phone: '+91-9876543215' },
      { name: 'Rahul Verma', email: 'rahul.verma@email.com', phone: '+91-9876543216' },
      { name: 'Kavya Nair', email: 'kavya.nair@email.com', phone: '+91-9876543217' },
      { name: 'Suresh Iyer', email: 'suresh.iyer@email.com', phone: '+91-9876543218' },
      { name: 'Meera Joshi', email: 'meera.joshi@email.com', phone: '+91-9876543219' }
    ];

    const statuses = ['pending', 'packed', 'out_for_delivery', 'delivered'];
    
    for (const storeId of storeIds) {
      const collection = await getCollection(`${storeId}_order`);
      
      // Generate 25 orders for each store
      const orders = [];
      
      for (let i = 0; i < 25; i++) {
        const customer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
        
        const order = {
          orderId: new ObjectId(),
          customerId: customer.email,
          products: [{
            id: `prod_${Math.random().toString(36).substr(2, 9)}`,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: '/placeholder-product.jpg'
          }],
          orderDate: orderDate,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          totalAmount: product.price * quantity,
          shippingAddress: {
            fullName: customer.name,
            email: customer.email,
            phone: customer.phone,
            addressLine1: `${Math.floor(Math.random() * 999) + 1}, ${['MG Road', 'Brigade Road', 'Commercial Street', 'Indiranagar', 'Koramangala'][Math.floor(Math.random() * 5)]}`,
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: `56000${Math.floor(Math.random() * 10)}`,
            country: 'India'
          },
          createdAt: orderDate,
          updatedAt: orderDate
        };
        
        orders.push(order);
      }
      
      // Insert orders
      await collection.insertMany(orders);
      console.log(`Inserted ${orders.length} sample orders for ${storeId}`);
    }
    
    console.log('Sample orders seeded successfully!');
    return { success: true, message: 'Sample orders seeded successfully' };
    
  } catch (error) {
    console.error('Error seeding sample orders:', error);
    return { success: false, error: error.message };
  }
}

// API endpoint to trigger seeding
export async function GET() {
  const result = await seedSampleOrders();
  return Response.json(result);
}