import axios from 'axios';

async function testPurchase() {
  try {
    console.log('🧪 Testing Purchase Functionality...\n');
    
    // First login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@sweetshop.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Login successful');
    
    // Get sweets to find one to purchase
    console.log('2. Getting sweets...');
    const sweetsResponse = await axios.get('http://localhost:5000/api/sweets');
    const sweets = sweetsResponse.data.sweets;
    
    if (sweets.length === 0) {
      console.log('❌ No sweets found to purchase');
      return;
    }
    
    const sweet = sweets[0];
    console.log(`🍭 Testing purchase of: ${sweet.name} (Quantity: ${sweet.quantity})`);
    
    // Test purchase
    console.log('3. Attempting purchase...');
    const purchaseResponse = await axios.post(
      `http://localhost:5000/api/sweets/${sweet._id}/purchase`,
      { quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Purchase successful!');
    console.log(`📦 Remaining quantity: ${purchaseResponse.data.sweet.quantity}`);
    console.log(`💰 Order total: $${purchaseResponse.data.order.totalAmount}`);
    
  } catch (error) {
    console.log('❌ Purchase failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.log('Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testPurchase();
