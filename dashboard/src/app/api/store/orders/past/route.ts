import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { PastOrder } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const possibleCollections = [
      'store_1_sale',
      'store-001_sale',
      'store-002_sale',
      'store-003_sale',
      'sales',
      'past_orders'
    ];

    let allOrders: PastOrder[] = [];

    for (const collectionName of possibleCollections) {
      try {
        const collection = await getCollection(collectionName);
        const orders = await collection.find({}).toArray();

        if (orders.length > 0) {
          const processedOrders = orders.map(order => {
            try {
              let formattedDate = '';
              let formattedTime = '';

              if (order.Date) {
                try {
                  let dateValue = order.Date;

                  if (typeof dateValue === 'object' && dateValue.toISOString) {
                    dateValue = dateValue.toISOString();
                  }

                  if (typeof dateValue === 'string') {
                    const dateObj = new Date(dateValue);
                    if (!isNaN(dateObj.getTime())) {
                      formattedDate = dateObj.toISOString().split('T')[0];
                    } else {
                      console.warn('Invalid date value:', dateValue);
                      formattedDate = '';
                    }
                  }
                } catch (dateError) {
                  console.error('Error parsing date:', order.Date, dateError);
                  formattedDate = '';
                }
              }

              if (order.Time) {
                try {
                  let timeValue = order.Time;
                  if (typeof timeValue === 'string') {
                    timeValue = timeValue.replace(/^"|"$/g, '');

                    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;
                    if (timeRegex.test(timeValue)) {
                      if (timeValue.length === 5) {
                        timeValue += ':00';
                      }
                      formattedTime = timeValue;
                    } else {
                      console.warn('Invalid time format:', timeValue);
                      formattedTime = '00:00:00';
                    }
                  }
                } catch (timeError) {
                  console.error('Error parsing time:', order.Time, timeError);
                  formattedTime = '00:00:00';
                }
              }

              let orderStatus: 'fulfilled' | 'delivered' = 'delivered';
              if (order.status && typeof order.status === 'string') {
                const statusLower = order.status.toLowerCase();
                orderStatus = statusLower === 'fulfilled' ? 'fulfilled' : 'delivered';
              }

              return {
                _id: order._id ? order._id.toString() : '',
                Date: formattedDate,
                Time: formattedTime,
                Store_ID: typeof order.Store_ID === 'string' ? order.Store_ID.replace(/^"|"$/g, '') : order.Store_ID || '',
                Transaction_ID: typeof order.Transaction_ID === 'string' ? order.Transaction_ID.replace(/^"|"$/g, '') : order.Transaction_ID || '',
                Customer_ID: typeof order.Customer_ID === 'string' ? order.Customer_ID.replace(/^"|"$/g, '') : order.Customer_ID || '',
                Customer_Type: typeof order.Customer_Type === 'string' ? order.Customer_Type.replace(/^"|"$/g, '') : order.Customer_Type || '',
                Category: typeof order.Category === 'string' ? order.Category.replace(/^"|"$/g, '') : order.Category || '',
                Product_Name: typeof order.Product_Name === 'string' ? order.Product_Name.replace(/^"|"$/g, '') : order.Product_Name || '',
                Quantity: Number(order.Quantity) || 0,
                Unit_Cost: Number(order.Unit_Cost) || 0,
                Unit_Price: Number(order.Unit_Price) || 0,
                Discount_Rate: Number(order.Discount_Rate) || 0,
                Discount_Amount: Number(order.Discount_Amount) || 0,
                Subtotal: Number(order.Subtotal) || 0,
                Tax_Amount: Number(order.Tax_Amount) || 0,
                Total_Amount: Number(order.Total_Amount) || 0,
                Gross_Profit: Number(order.Gross_Profit) || 0,
                Profit_Margin_Percent: Number(order.Profit_Margin_Percent) || 0,
                Payment_Method: typeof order.Payment_Method === 'string' ? order.Payment_Method.replace(/^"|"$/g, '') : order.Payment_Method || '',
                Day_of_Week: typeof order.Day_of_Week === 'string' ? order.Day_of_Week.replace(/^"|"$/g, '') : order.Day_of_Week || '',
                Month: typeof order.Month === 'string' ? order.Month.replace(/^"|"$/g, '') : order.Month || '',
                Hour_of_Day: Number(order.Hour_of_Day) || 0,
                Transaction_Total: Number(order.Transaction_Total) || 0,
                Items_Per_Transaction: Number(order.Items_Per_Transaction) || 0,
                status: orderStatus,
              };
            } catch (orderError) {
              console.error('Error processing order:', order, orderError);
              return {
                _id: order._id ? order._id.toString() : '',
                Date: '',
                Time: '00:00:00',
                Store_ID: '',
                Transaction_ID: order.Transaction_ID || '',
                Customer_ID: '',
                Customer_Type: '',
                Category: '',
                Product_Name: '',
                Quantity: 0,
                Unit_Cost: 0,
                Unit_Price: 0,
                Discount_Rate: 0,
                Discount_Amount: 0,
                Subtotal: 0,
                Tax_Amount: 0,
                Total_Amount: 0,
                Gross_Profit: 0,
                Profit_Margin_Percent: 0,
                Payment_Method: '',
                Day_of_Week: '',
                Month: '',
                Hour_of_Day: 0,
                Transaction_Total: 0,
                Items_Per_Transaction: 0,
                status: 'delivered' as const,
              };
            }
          }).filter(order => order._id);
          allOrders.push(...processedOrders);
        }
      } catch (collectionError: unknown) {
        const errorMessage = collectionError instanceof Error ? collectionError.message : 'Unknown error';
        console.warn(`Could not access collection ${collectionName}:`, errorMessage);
      }
    }

    allOrders.sort((a, b) => {
      try {
        if (!a.Date || !b.Date) return 0;

        const dateA = new Date(a.Date + 'T' + (a.Time || '00:00:00'));
        const dateB = new Date(b.Date + 'T' + (b.Time || '00:00:00'));

        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      } catch (sortError) {
        console.warn('Error sorting orders:', sortError);
        return 0;
      }
    });

    if (search) {
      const searchLower = search.toLowerCase();
      allOrders = allOrders.filter(order => {
        try {
          return (order.Transaction_ID || '').toLowerCase().includes(searchLower) ||
            (order.Customer_ID || '').toLowerCase().includes(searchLower) ||
            (order.Product_Name || '').toLowerCase().includes(searchLower);
        } catch (filterError) {
          console.warn('Error filtering order:', order, filterError);
          return false;
        }
      });
    }

    if (status && status !== 'all') {
      allOrders = allOrders.filter(order => order.status === status);
    }

    const startIndex = (page - 1) * limit;
    const paginatedOrders = allOrders.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      total: allOrders.length,
      page,
      limit,
      totalPages: Math.ceil(allOrders.length / limit)
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching past orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch past orders', details: errorMessage },
      { status: 500 }
    );
  }
}