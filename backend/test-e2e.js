const API_URL = 'http://localhost:5000/api';
let userAToken = '';
let userBToken = '';
let adminToken = '';

const fetchAPI = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok && res.status !== 403 && res.status !== 400 && res.status !== 404) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return { status: res.status, data: await res.json() };
  }
  return { status: res.status, data: await res.text() };
};

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const logTest = (name, success, msg = '') => {
    if (success) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name} - ${msg}`);
      failed++;
    }
  };

  try {
    // 1. REGISTRATION
    const userA = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: `User A ${Date.now()}`, email: `usera${Date.now()}@example.com`, password: 'password123' })
    });
    logTest('Register User A', userA.status === 201 && userA.data.token);

    const userB = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: `User B ${Date.now()}`, email: `userb${Date.now()}@example.com`, password: 'password123' })
    });
    logTest('Register User B', userB.status === 201 && userB.data.token);

    // 2. LOGIN
    userAToken = userA.data.token;
    userBToken = userB.data.token;

    const adminLogin = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@financeflow.com', password: 'password123' })
    });
    adminToken = adminLogin.data.token;
    logTest('Admin Login', adminLogin.status === 200);

    const authConfigA = { headers: { Authorization: `Bearer ${userAToken}` } };
    const authConfigB = { headers: { Authorization: `Bearer ${userBToken}` } };
    const adminConfig = { headers: { Authorization: `Bearer ${adminToken}` } };

    // 3. TRANSACTIONS
    const tx = await fetchAPI('/transactions', {
      method: 'POST',
      body: JSON.stringify({ type: 'Income', amount: 10000, category: 'Salary', description: 'Test Income', date: new Date() }),
      ...authConfigA
    });
    logTest('Create Transaction A', tx.status === 201 && tx.data.amount === 10000);

    const getTxA = await fetchAPI('/transactions', { method: 'GET', ...authConfigA });
    logTest('Read Transactions A', getTxA.data.length >= 1);

    // 4. USER ISOLATION
    const getTxB = await fetchAPI('/transactions', { method: 'GET', ...authConfigB });
    logTest('User Isolation (Transactions)', getTxB.data.length === 0);

    // 5. HABITS
    const habit = await fetchAPI('/habits', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Habit', frequency: 'Daily', target: 1, reminder: true }),
      ...authConfigA
    });
    logTest('Create Habit', habit.status === 201);
    
    await fetchAPI(`/habits/${habit.data._id}/complete`, { method: 'POST', ...authConfigA });
    const getHabits = await fetchAPI('/habits', { method: 'GET', ...authConfigA });
    const createdHabit = getHabits.data.find(h => h._id === habit.data._id);
    logTest('Complete Habit & Streak calculation', createdHabit && createdHabit.streak === 1);

    // 6. SAVINGS GOALS
    const goal = await fetchAPI('/goals', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Goal', targetAmount: 50000, category: 'Emergency Fund', deadline: new Date() }),
      ...authConfigA
    });
    logTest('Create Goal', goal.status === 201);

    await fetchAPI(`/goals/${goal.data._id}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ amount: 10000 }),
      ...authConfigA
    });
    const getGoals = await fetchAPI('/goals', { method: 'GET', ...authConfigA });
    const createdGoal = getGoals.data.find(g => g._id === goal.data._id);
    logTest('Goal Contribution & Progress', createdGoal && createdGoal.currentAmount === 10000);

    // 7. WEALTH & ASSETS
    const asset = await fetchAPI('/assets', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Asset', type: 'Stocks', investedAmount: 5000, currentValue: 6000, purchaseDate: new Date() }),
      ...authConfigA
    });
    logTest('Create Asset', asset.status === 201);
    
    const getAssets = await fetchAPI('/assets', { method: 'GET', ...authConfigA });
    logTest('Read Assets', getAssets.data.length >= 1);

    // 8. DASHBOARD & HEALTH SCORE
    const summary = await fetchAPI('/dashboard/summary', { method: 'GET', ...authConfigA });
    const { totalBalance, currentNetWorth, healthScore } = summary.data;
    // We can't strictly compare exact numbers if there's seeded data, but we can verify calculation logic exists
    logTest('Dashboard Metrics Exists', typeof totalBalance === 'number' && typeof currentNetWorth === 'number');
    logTest('Financial Health Score logic', typeof healthScore === 'number' && healthScore >= 0 && healthScore <= 100);

    const analytics = await fetchAPI('/dashboard/analytics', { method: 'GET', ...authConfigA });
    logTest('Dashboard Analytics (Recharts format)', Array.isArray(analytics.data.cashFlow));

    // 9. ADMIN & RBAC
    const adminAccessFail = await fetchAPI('/admin/users', { method: 'GET', ...authConfigA });
    logTest('Admin Route RBAC (User Rejected)', adminAccessFail.status === 403);

    const adminUsers = await fetchAPI('/admin/users', { method: 'GET', ...adminConfig });
    logTest('Admin Route RBAC (Admin Accepted)', adminUsers.status === 200 && Array.isArray(adminUsers.data));

    // 10. PROFILE
    const profile = await fetchAPI('/profile', {
      method: 'PUT',
      body: JSON.stringify({ name: 'User A Modified' }),
      ...authConfigA
    });
    logTest('Profile Update', profile.data.name === 'User A Modified');

  } catch (error) {
    console.error('Test Execution Error:', error.message);
  }

  console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
};

runTests();
