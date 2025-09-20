#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let accessToken = '';
let refreshToken = '';
let adminToken = '';
let sweetId = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123'
};

const testAdmin = {
  email: 'admin@sweetshop.com',
  password: 'admin123'
};

const testSweet = {
  name: 'Test Chocolate Cake',
  category: 'Cakes',
  price: 29.99,
  quantity: 15,
  description: 'A delicious test chocolate cake for API testing',
  imageUrl: 'https://example.com/test-cake.jpg'
};

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Test functions
async function testUserRegistration() {
  console.log('\n🔐 Testing User Registration...');
  const result = await makeRequest('POST', '/auth/register', testUser);
  
  if (result.success) {
    console.log('✅ User registration successful');
    accessToken = result.data.accessToken;
    refreshToken = result.data.refreshToken;
    return true;
  } else {
    console.log('❌ User registration failed:', result.error);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔐 Testing User Login...');
  const result = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (result.success) {
    console.log('✅ User login successful');
    accessToken = result.data.accessToken;
    refreshToken = result.data.refreshToken;
    return true;
  } else {
    console.log('❌ User login failed:', result.error);
    return false;
  }
}

async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...');
  const result = await makeRequest('POST', '/auth/login', testAdmin);
  
  if (result.success) {
    console.log('✅ Admin login successful');
    adminToken = result.data.accessToken;
    return true;
  } else {
    console.log('❌ Admin login failed:', result.error);
    return false;
  }
}

async function testTokenRefresh() {
  console.log('\n🔄 Testing Token Refresh...');
  const result = await makeRequest('POST', '/auth/refresh', { refreshToken });
  
  if (result.success) {
    console.log('✅ Token refresh successful');
    accessToken = result.data.accessToken;
    return true;
  } else {
    console.log('❌ Token refresh failed:', result.error);
    return false;
  }
}

async function testGetSweets() {
  console.log('\n🍭 Testing Get All Sweets...');
  const result = await makeRequest('GET', '/sweets');
  
  if (result.success) {
    console.log('✅ Get sweets successful');
    console.log(`   Found ${result.data.sweets.length} sweets`);
    return true;
  } else {
    console.log('❌ Get sweets failed:', result.error);
    return false;
  }
}

async function testSearchSweets() {
  console.log('\n🔍 Testing Search Sweets...');
  const result = await makeRequest('GET', '/sweets/search?q=chocolate&category=Cakes');
  
  if (result.success) {
    console.log('✅ Search sweets successful');
    console.log(`   Found ${result.data.sweets.length} matching sweets`);
    return true;
  } else {
    console.log('❌ Search sweets failed:', result.error);
    return false;
  }
}

async function testCreateSweet() {
  console.log('\n➕ Testing Create Sweet (Admin)...');
  const result = await makeRequest('POST', '/sweets', testSweet, adminToken);
  
  if (result.success) {
    console.log('✅ Create sweet successful');
    sweetId = result.data.sweet._id;
    console.log(`   Created sweet with ID: ${sweetId}`);
    return true;
  } else {
    console.log('❌ Create sweet failed:', result.error);
    return false;
  }
}

async function testGetSweetById() {
  console.log('\n🔍 Testing Get Sweet by ID...');
  const result = await makeRequest('GET', `/sweets/${sweetId}`);
  
  if (result.success) {
    console.log('✅ Get sweet by ID successful');
    console.log(`   Sweet name: ${result.data.sweet.name}`);
    return true;
  } else {
    console.log('❌ Get sweet by ID failed:', result.error);
    return false;
  }
}

async function testUpdateSweet() {
  console.log('\n✏️ Testing Update Sweet (Admin)...');
  const updateData = {
    name: 'Updated Test Chocolate Cake',
    price: 34.99,
    quantity: 20
  };
  
  const result = await makeRequest('PUT', `/sweets/${sweetId}`, updateData, adminToken);
  
  if (result.success) {
    console.log('✅ Update sweet successful');
    console.log(`   Updated price: $${result.data.sweet.price}`);
    return true;
  } else {
    console.log('❌ Update sweet failed:', result.error);
    return false;
  }
}

async function testPurchaseSweet() {
  console.log('\n🛒 Testing Purchase Sweet...');
  const result = await makeRequest('POST', `/sweets/${sweetId}/purchase`, { quantity: 2 }, accessToken);
  
  if (result.success) {
    console.log('✅ Purchase sweet successful');
    console.log(`   Remaining quantity: ${result.data.sweet.quantity}`);
    return true;
  } else {
    console.log('❌ Purchase sweet failed:', result.error);
    return false;
  }
}

async function testRestockSweet() {
  console.log('\n📦 Testing Restock Sweet (Admin)...');
  const result = await makeRequest('POST', `/sweets/${sweetId}/restock`, { quantity: 5 }, adminToken);
  
  if (result.success) {
    console.log('✅ Restock sweet successful');
    console.log(`   New quantity: ${result.data.sweet.quantity}`);
    return true;
  } else {
    console.log('❌ Restock sweet failed:', result.error);
    return false;
  }
}

async function testDeleteSweet() {
  console.log('\n🗑️ Testing Delete Sweet (Admin)...');
  const result = await makeRequest('DELETE', `/sweets/${sweetId}`, null, adminToken);
  
  if (result.success) {
    console.log('✅ Delete sweet successful');
    return true;
  } else {
    console.log('❌ Delete sweet failed:', result.error);
    return false;
  }
}

async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Unauthorized Access...');
  const result = await makeRequest('POST', '/sweets', testSweet);
  
  if (!result.success && result.status === 401) {
    console.log('✅ Unauthorized access properly blocked');
    return true;
  } else {
    console.log('❌ Unauthorized access not properly blocked');
    return false;
  }
}

async function testAdminOnlyAccess() {
  console.log('\n🚫 Testing Admin-Only Access...');
  const result = await makeRequest('POST', '/sweets', testSweet, accessToken);
  
  if (!result.success && result.status === 403) {
    console.log('✅ Admin-only access properly blocked for regular users');
    return true;
  } else {
    console.log('❌ Admin-only access not properly blocked');
    return false;
  }
}

async function testLogout() {
  console.log('\n🚪 Testing Logout...');
  const result = await makeRequest('POST', '/auth/logout', null, accessToken);
  
  if (result.success) {
    console.log('✅ Logout successful');
    return true;
  } else {
    console.log('❌ Logout failed:', result.error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  const tests = [
    testUserRegistration,
    testUserLogin,
    testAdminLogin,
    testTokenRefresh,
    testGetSweets,
    testSearchSweets,
    testCreateSweet,
    testGetSweetById,
    testUpdateSweet,
    testPurchaseSweet,
    testRestockSweet,
    testUnauthorizedAccess,
    testAdminOnlyAccess,
    testDeleteSweet,
    testLogout
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! API is fully compliant with requirements.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the implementation.');
  }
}

// Run tests
runTests().catch(console.error);
