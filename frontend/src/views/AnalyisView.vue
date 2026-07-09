<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/utils/axios";
import NavLink from "@/components/NavLink.vue";
import LogoutButton from "@/components/LogoutButton.vue";

const monthlySummary = ref([]);
const selectedMonthData = ref(null);
const loading = ref(false);
const error = ref("");
const selectedMonthKey = ref(null);

const loadMonthlySummary = async () => {
  loading.value = true;
  error.value = "";
  
  try {
    const response = await api.get("/transactions/months");
    monthlySummary.value = response.data.months || [];
  } catch (err) {
    console.error("Error loading monthly summary:", err);
    error.value = err.response?.data?.msg || "Failed to load data";
  } finally {
    loading.value = false;
  }
};

const loadMonthData = async (year, month) => {
  const key = `${year}-${month}`;
  if (selectedMonthKey.value === key) {
    selectedMonthKey.value = null;
    selectedMonthData.value = null;
    return;
  }
  
  try {
    const response = await api.get(`/transactions/month/${year}/${month}`);
    selectedMonthData.value = response.data;
    selectedMonthKey.value = key;
  } catch (err) {
    console.error("Error loading month data:", err);
    alert(err.response?.data?.msg || "Failed to load month data");
  }
};

const getMonthName = (year, month) => {
  return new Date(year, month - 1).toLocaleString('default', { month: 'long' });
};

const formatCurrency = (amount) => {
  return Number(amount).toFixed(2);
};

const isSelected = (year, month) => {
  return selectedMonthKey.value === `${year}-${month}`;
};

const getBalanceColor = (amount) => {
  if (amount > 0) return 'text-green-600';
  if (amount < 0) return 'text-red-600';
  return 'text-gray-600';
};

const getBorderColor = (amount) => {
  if (amount > 0) return 'border-l-green-500';
  if (amount < 0) return 'border-l-red-500';
  return 'border-l-gray-400';
};


const totalIncome = computed(() => {
  return monthlySummary.value.reduce((sum, m) => sum + Number(m.total_income), 0);
});

const totalExpense = computed(() => {
  return monthlySummary.value.reduce((sum, m) => sum + Number(m.total_expense), 0);
});

const totalBalance = computed(() => {
  return totalIncome.value - totalExpense.value;
});

onMounted(() => {
  loadMonthlySummary();
});
</script>

<template>
  <nav>
    <div class="bg-green-300 flex px-3 py-2 justify-between items-center">
      <span class="text-green-800 font-bold ml-2">💰 Budget Tracker</span>
      <ul class="flex gap-1.5">
        <li><NavLink to="/" text="Home" /></li>
        <li><NavLink to="/dashboard" text="Dashboard" /></li>
        <li><LogoutButton /></li>
      </ul>
    </div>
  </nav>

  <section class="bg-green-50 min-h-screen p-2">
    <div class="p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="font-bold text-green-600 text-3xl">Monthly Analytics</h1>
          <p class="text-gray-500 mt-1">Track your spending month by month</p>
        </div>
        <button
          @click="loadMonthlySummary"
          class="px-4 py-2 rounded-xl font-medium bg-green-600 text-white hover:bg-green-400 transition"
        >
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Loading financial data...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="monthlySummary.length === 0" class="text-center py-10">
      <p class="text-gray-500">No transactions yet. Start tracking your budget!</p>
      <router-link to="/dashboard" class="inline-block mt-4 bg-green-500 text-white px-6 py-2 rounded-lg">
        Go to Dashboard
      </router-link>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-3xl p-5 shadow border-l-green-500 border-l-4">
          <h3 class="text-xl text-gray-500">Total Income</h3>
          <p class="text-2xl font-bold text-green-600">
            ${{ formatCurrency(totalIncome) }}
          </p>
          <p class="text-sm text-gray-400">Across all months</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow border-l-red-500 border-l-4">
          <h3 class="text-xl text-gray-500">Total Expense</h3>
          <p class="text-2xl font-bold text-red-600">
            ${{ formatCurrency(totalExpense) }}
          </p>
          <p class="text-sm text-gray-400">Across all months</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow border-l-yellow-500 border-l-4">
          <h3 class="text-xl text-gray-500">Net Balance</h3>
          <p class="text-2xl font-bold" :class="getBalanceColor(totalBalance)">
            ${{ formatCurrency(totalBalance) }}
          </p>
          <p class="text-sm text-gray-400">Overall financial health</p>
        </div>
      </div>

      <h2 class="text-xl font-bold mb-4">Monthly Breakdown</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="month in monthlySummary" 
          :key="`${month.year}-${month.month}`"
          @click="loadMonthData(month.year, month.month)"
          class="bg-white rounded-3xl shadow p-5 hover:shadow-lg cursor-pointer transition border-l-4"
          :class="[
            isSelected(month.year, month.month) ? 'border-l-blue-500 bg-blue-50' : getBorderColor(month.net_balance)
          ]"
        >
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-bold">
              {{ getMonthName(month.year, month.month) }}
              <span class="text-sm font-normal text-gray-400">{{ month.year }}</span>
            </h3>
            <span class="text-xs text-gray-400">{{ month.transaction_count }} txns</span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 mt-3">
            <div>
              <p class="text-xs text-gray-500">Income</p>
              <p class="text-green-600 font-semibold">${{ formatCurrency(month.total_income) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Expense</p>
              <p class="text-red-600 font-semibold">${{ formatCurrency(month.total_expense) }}</p>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t">
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">Net Balance</p>
              <p class="font-bold text-lg" :class="getBalanceColor(month.net_balance)">
                ${{ formatCurrency(month.net_balance) }}
              </p>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                class="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                :style="{ 
                  width: Number(month.total_income) > 0 
                    ? Math.min((Number(month.total_expense) / Number(month.total_income)) * 100, 100) + '%' 
                    : '0%' 
                }"
              ></div>
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {{ Number(month.total_income) > 0 
                ? Math.round((Number(month.total_expense) / Number(month.total_income)) * 100) 
                : 0 }}% of income spent
            </p>
          </div>
          
          <div v-if="isSelected(month.year, month.month)" class="mt-2 text-center">
            <span class="text-xs text-blue-500 font-medium">▼ Click to close</span>
          </div>
        </div>
      </div>

      <div v-if="selectedMonthData" class="mt-6 bg-white rounded-3xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">
            {{ getMonthName(selectedMonthData.year, selectedMonthData.month) }} {{ selectedMonthData.year }} - Details
          </h3>
          <span class="text-xs text-gray-400">{{ selectedMonthData.data?.length || 0 }} transactions</span>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-green-50 rounded-xl p-3 text-center">
            <p class="text-sm text-gray-500">Income</p>
            <p class="text-green-600 font-bold text-xl">${{ formatCurrency(selectedMonthData.summary?.total_income || 0) }}</p>
          </div>
          <div class="bg-red-50 rounded-xl p-3 text-center">
            <p class="text-sm text-gray-500">Expense</p>
            <p class="text-red-600 font-bold text-xl">${{ formatCurrency(selectedMonthData.summary?.total_expense || 0) }}</p>
          </div>
          <div class="bg-blue-50 rounded-xl p-3 text-center">
            <p class="text-sm text-gray-500">Balance</p>
            <p class="font-bold text-xl" :class="getBalanceColor(selectedMonthData.summary?.net_balance || 0)">
              ${{ formatCurrency(selectedMonthData.summary?.net_balance || 0) }}
            </p>
          </div>
        </div>

        <div v-if="selectedMonthData.category && selectedMonthData.category.length > 0">
          <h4 class="font-semibold mb-3">Spending by Category</h4>
          <div v-for="cat in selectedMonthData.category" :key="cat.category" class="mb-3">
            <div class="flex justify-between items-center">
              <span class="capitalize font-medium">{{ cat.category }}</span>
              <span class="font-bold">${{ formatCurrency(cat.total) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                :style="{ 
                  width: (Number(cat.total) / Number(selectedMonthData.summary?.total_expense || 1)) * 100 + '%' 
                }"
              ></div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400 text-center py-4">No expense categories for this month</p>

        <div v-if="selectedMonthData.data && selectedMonthData.data.length > 0" class="mt-4">
          <h4 class="font-semibold mb-3">Transactions</h4>
          <div class="max-h-60 overflow-y-auto">
            <div v-for="item in selectedMonthData.data" :key="item.id" 
                 class="border-b py-2 flex justify-between items-center">
              <div>
                <span class="font-medium">{{ item.category }}</span>
                <span v-if="item.description" class="text-sm text-gray-400 ml-2">- {{ item.description }}</span>
              </div>
              <div class="text-right">
                <span :class="item.type === 'income' ? 'text-green-600' : 'text-red-500'" class="font-bold">
                  ${{ formatCurrency(item.amount) }}
                </span>
                <span class="text-xs text-gray-400 block">
                  {{ new Date(item.date).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
