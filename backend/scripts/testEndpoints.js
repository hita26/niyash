process.env.NODE_ENV = 'test';
const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const mongoose = require('mongoose');
const app = require('../server');
const connectDB = require('../config/db');

// Helper to make HTTP requests to the in-memory server
const makeRequest = (server, options, requestData = null) => {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const opt = {
      hostname: '127.0.0.1',
      port: address.port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(opt, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          // keep as string
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (requestData) {
      req.write(typeof requestData === 'string' ? requestData : JSON.stringify(requestData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🚀 Starting Backend Route Verification Tests...\n');
  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`📡 Test server running on port ${port}\n`);

  let passCount = 0;
  let failCount = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failCount++;
    }
  };

  try {
    // ----------------------------------------------------
    // TEST 1: GET /api/products/meta/filters
    // ----------------------------------------------------
    console.log('--- TEST 1: GET /api/products/meta/filters ---');
    const filterRes = await makeRequest(server, { path: '/api/products/meta/filters' });
    assert(filterRes.statusCode === 200, 'Status code is 200');
    assert(filterRes.data.success === true, 'Success flag is true');
    assert(Array.isArray(filterRes.data.companies) && filterRes.data.companies.length > 0, `Companies array returned (${filterRes.data.companies?.join(', ')})`);
    assert(Array.isArray(filterRes.data.forms) && filterRes.data.forms.length > 0, `Forms array returned (${filterRes.data.forms?.length} forms)`);
    assert(Array.isArray(filterRes.data.categories) && filterRes.data.categories.length > 0, `Categories array returned (${filterRes.data.categories?.length} categories)`);
    console.log('');

    // ----------------------------------------------------
    // TEST 2: GET /api/products with advanced queries
    // ----------------------------------------------------
    console.log('--- TEST 2: GET /api/products with queries ---');
    const productsRes = await makeRequest(server, { path: '/api/products?company=DAXIA&form=Tablet&inStock=true&limit=3' });
    assert(productsRes.statusCode === 200, 'Status code is 200');
    assert(productsRes.data.success === true, 'Success flag is true');
    assert(Array.isArray(productsRes.data.products), 'Products array returned');
    assert(productsRes.data.products.length > 0, `Returned ${productsRes.data.products.length} products`);
    console.log('');

    // ----------------------------------------------------
    // TEST 3: POST /api/orders & WhatsApp message payload
    // ----------------------------------------------------
    console.log('--- TEST 3: POST /api/orders & WhatsApp URL Generation ---');
    const orderPayload = {
      shopName: 'Apollo Pharmacy Test',
      retailerMobile: '9825099999',
      retailerEmail: 'apollo.test@gmail.com',
      gstin: '24TESTG1234F1Z9',
      destinationWhatsApp: '9316566894',
      items: [
        {
          productName: 'MUCIDAX 600 TAB',
          company: 'DAXIA',
          form: 'Tablet',
          boxes: 2,
          unitsPerBox: 10,
          unitPrice: 185.00,
          gstRate: 12,
        },
        {
          productName: 'BENIDAX 4 mg TAB',
          company: 'DAXIA',
          form: 'Tablet',
          boxes: 1,
          unitsPerBox: 10,
          unitPrice: 72.00,
          gstRate: 12,
        },
      ],
      discountAmount: 100,
    };

    const orderRes = await makeRequest(server, { path: '/api/orders', method: 'POST' }, orderPayload);
    assert(orderRes.statusCode === 201, 'Order created with status 201');
    assert(orderRes.data.success === true, 'Response success is true');
    assert(orderRes.data.order && orderRes.data.order.orderNumber, `Order created with orderNumber: ${orderRes.data.order?.orderNumber}`);
    assert(orderRes.data.order.subTotal === 4420, `Subtotal calculated accurately: ₹${orderRes.data.order?.subTotal}`);
    assert(orderRes.data.order.gstAmount === 530.4, `GST calculated accurately: ₹${orderRes.data.order?.gstAmount}`);
    assert(orderRes.data.order.discountAmount === 100, `Discount applied accurately: ₹${orderRes.data.order?.discountAmount}`);
    assert(orderRes.data.order.grandTotal === 4850.4, `Grand total calculated accurately: ₹${orderRes.data.order?.grandTotal}`);
    assert(typeof orderRes.data.whatsappMessage === 'string' && orderRes.data.whatsappMessage.includes('Apollo Pharmacy Test'), 'WhatsApp message contains shopName');
    assert(typeof orderRes.data.whatsappUrl === 'string' && orderRes.data.whatsappUrl.startsWith('https://api.whatsapp.com/send?phone=919316566894'), 'WhatsApp URL matches specification');
    const createdOrderId = orderRes.data.order?._id;
    console.log('');

    // ----------------------------------------------------
    // TEST 4: GET /api/orders & PUT /api/orders/:id/status
    // ----------------------------------------------------
    console.log('--- TEST 4: Order Retrieval & Status Update ---');
    const getOrdersRes = await makeRequest(server, { path: '/api/orders?retailerMobile=9825099999' });
    assert(getOrdersRes.statusCode === 200, 'Orders list retrieved with status 200');
    assert(getOrdersRes.data.orders.length >= 1, `Found ${getOrdersRes.data.orders.length} order(s) for retailer`);

    const updateStatusRes = await makeRequest(
      server,
      { path: `/api/orders/${createdOrderId}/status`, method: 'PUT' },
      { orderStatus: 'Confirmed' }
    );
    assert(updateStatusRes.statusCode === 200, 'Order status updated with status 200');
    assert(updateStatusRes.data.order?.orderStatus === 'Confirmed', 'Order status updated to Confirmed');
    console.log('');

    // ----------------------------------------------------
    // TEST 5: GET /api/ledger/:mobile (9825012345)
    // ----------------------------------------------------
    console.log('--- TEST 5: GET /api/ledger/9825012345 ---');
    const ledgerRes = await makeRequest(server, { path: '/api/ledger/9825012345' });
    assert(ledgerRes.statusCode === 200, 'Ledger retrieved with status 200');
    assert(ledgerRes.data.success === true, 'Response success is true');
    assert(ledgerRes.data.ledger?.shopName === 'Shanti Medico', `Ledger shopName: ${ledgerRes.data.ledger?.shopName}`);
    assert(ledgerRes.data.ledger?.retailerMobile === '9825012345', 'Retailer mobile matched');
    assert(Array.isArray(ledgerRes.data.ledger?.invoices), `Invoices count: ${ledgerRes.data.ledger?.invoices?.length}`);
    const initialOutstanding = ledgerRes.data.ledger?.outstandingBalance;
    console.log(`  ℹ️ Initial outstanding balance: ₹${initialOutstanding}`);
    console.log('');

    // ----------------------------------------------------
    // TEST 6: POST /api/ledger/payment (FIFO invoice deduction)
    // ----------------------------------------------------
    console.log('--- TEST 6: POST /api/ledger/payment ---');
    const paymentPayload = {
      retailerMobile: '9825012345',
      amount: 15000,
      method: 'UPI',
      transactionRef: 'UPI/TEST99881122',
      notes: 'Test settlement',
    };

    const paymentRes = await makeRequest(server, { path: '/api/ledger/payment', method: 'POST' }, paymentPayload);
    assert(paymentRes.statusCode === 200, 'Payment recorded with status 200');
    assert(paymentRes.data.success === true, 'Response success is true');
    assert(paymentRes.data.receipt?.amount === 15000, 'Receipt amount is 15000');
    assert(paymentRes.data.ledger?.outstandingBalance === initialOutstanding - 15000, `Outstanding balance reduced to ₹${paymentRes.data.ledger?.outstandingBalance}`);
    console.log('');

    // ----------------------------------------------------
    // TEST 7: POST /api/ledger/send-statement
    // ----------------------------------------------------
    console.log('--- TEST 7: POST /api/ledger/send-statement ---');
    const statementRes = await makeRequest(
      server,
      { path: '/api/ledger/send-statement', method: 'POST' },
      { retailerMobile: '9825012345', channel: 'whatsapp' }
    );
    assert(statementRes.statusCode === 200, 'Statement generated with status 200');
    assert(statementRes.data.success === true, 'Response success is true');
    assert(typeof statementRes.data.statementText === 'string' && statementRes.data.statementText.includes('Shanti Medico'), 'Statement includes Shanti Medico');
    assert(typeof statementRes.data.whatsappUrl === 'string' && statementRes.data.whatsappUrl.includes('9825012345'), 'WhatsApp URL generated for retailer');
    console.log('');

    // ----------------------------------------------------
    // TEST 8: GET /api/news?ticker=true
    // ----------------------------------------------------
    console.log('--- TEST 8: GET /api/news?ticker=true ---');
    const tickerNewsRes = await makeRequest(server, { path: '/api/news?ticker=true' });
    assert(tickerNewsRes.statusCode === 200, 'News ticker fetched with status 200');
    assert(tickerNewsRes.data.success === true, 'Response success is true');
    assert(Array.isArray(tickerNewsRes.data.news) && tickerNewsRes.data.news.length > 0, `Active ticker items returned (${tickerNewsRes.data.news.length} items)`);
    console.log('');

    // ----------------------------------------------------
    // TEST 9: POST, PUT, DELETE /api/news CRUD
    // ----------------------------------------------------
    console.log('--- TEST 9: POST, PUT, DELETE /api/news ---');
    const newNewsPayload = {
      title: 'Monsoon Mega Scheme: Extra 5% Off on Bulk Orders',
      content: 'Applicable on all antibiotics and injectables this week.',
      category: 'Scheme',
      company: 'DAXIA',
      isTickerActive: true,
      priority: 1,
    };
    const createNewsRes = await makeRequest(server, { path: '/api/news', method: 'POST' }, newNewsPayload);
    assert(createNewsRes.statusCode === 201, 'News created with status 201');
    const newsId = createNewsRes.data.news?._id;

    const updateNewsRes = await makeRequest(
      server,
      { path: `/api/news/${newsId}`, method: 'PUT' },
      { priority: 5, isTickerActive: false }
    );
    assert(updateNewsRes.statusCode === 200, 'News updated with status 200');
    assert(updateNewsRes.data.news?.priority === 5, 'Priority updated to 5');
    assert(updateNewsRes.data.news?.isTickerActive === false, 'isTickerActive toggled to false');

    const deleteNewsRes = await makeRequest(server, { path: `/api/news/${newsId}`, method: 'DELETE' });
    assert(deleteNewsRes.statusCode === 200, 'News deleted with status 200');
    console.log('');

    // Summary
    console.log('====================================================');
    console.log(`📊 Test Summary: ${passCount} Passed, ${failCount} Failed`);
    console.log('====================================================');

    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.connection.close();
  }
};

runTests();
