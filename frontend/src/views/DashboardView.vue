<script setup>
import { onUnmounted } from "vue";
import { ref, onMounted, computed } from "vue";
import api from "@/utils/axios";
import NavLink from "@/components/NavLink.vue";
import LogoutButton from "@/components/LogoutButton.vue";

const transactions = ref([]);
const summary = ref({
  total_income: 0,
  total_expense: 0,
  net_balance: 0,
});
const categories = ref([]);
const loading = ref(false);
const error = ref("");
const showDescription = ref(false);

const toggleView = () => {
  showDescription.value = !showDescription.value;
};
const getDisplayText = (item) => {
  if (showDescription.value && item.description) {
    return item.description;
  }
  return item.category;
};

const toggleLabel = computed(() => {
  return showDescription.value ? "Show Category" : "Show Description";
});

const editId = ref(null);
const editData = ref({
  type: "expense",
  category: "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const allowedCategories = [
  "rent",
  "food",
  "transport",
  "utilities",
  "entertainment",
  "shopping",
  "health",
  "education",
  "other",
];

const loadData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/transactions");

    if (response.data && response.data.data) {
      transactions.value = response.data.data || [];
      categories.value = response.data.category || [];

      if (response.data.summary && response.data.summary.length > 0) {
        summary.value = response.data.summary[0];
      } else if (response.data.summary) {
        summary.value = response.data.summary;
      } else {
        summary.value = {
          total_income: 0,
          total_expense: 0,
          net_balance: 0,
        };
      }
    } else {
      transactions.value = [];
      categories.value = [];
      summary.value = {
        total_income: 0,
        total_expense: 0,
        net_balance: 0,
      };
    }
  } catch (err) {
    console.error("Load data error:", err);
    error.value =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      "Failed to load data";
  } finally {
    loading.value = false;
  }
};

const refresh = () => {
  loadData();
};

let refreshInterval;
onMounted(() => {
  loadData();
  refreshInterval = setInterval(loadData, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

const newTransaction = ref({
  type: "expense",
  category: "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const inputError = ref("");
const inputSuccess = ref("");

const addTransaction = async () => {
  inputError.value = "";
  inputSuccess.value = "";

  if (!newTransaction.value.category) {
    inputError.value = "Please enter a category";
    return;
  }
  if (!newTransaction.value.amount || newTransaction.value.amount <= 0) {
    inputError.value = "Please enter a valid amount";
    return;
  }

  try {
    await api.post("/transactions", newTransaction.value);
    inputSuccess.value = "Transaction added successfully!";

    newTransaction.value.category = "";
    newTransaction.value.amount = "";
    newTransaction.value.description = "";

    await loadData();

    setTimeout(() => {
      inputSuccess.value = "";
    }, 3000);
  } catch (err) {
    inputError.value =
      err.response?.data?.message || "Failed to add transaction";
  }
};

const deleteTransaction = async (id) => {
  if (!confirm("Do you want to delete this transaction?")) return;

  try {
    await api.delete(`/transactions/${id}`);
    await loadData();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete transaction");
  }
};

const edit = (item) => {
  editId.value = item.id;
  editData.value = {
    type: item.type,
    category: item.category,
    amount: item.amount,
    description: item.description || "",
    date: item.date
      ? new Date(item.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
};

const cancelEdit = () => {
  editId.value = null;
  editData.value = {
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  };
};

const saveEdit = async (id) => {
  try {
    const updatedData = {
      type: editData.value.type,
      category: editData.value.category,
      amount: parseFloat(editData.value.amount),
      description: editData.value.description,
      date: editData.value.date,
    };

    await api.patch(`/transactions/${id}`, updatedData);
    await loadData();
    cancelEdit();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update transaction");
  }
};
</script>

<template>
  <nav>
    <div class="bg-green-300 flex px-3 py-2 justify-between items-center">
      <span class="text-green-800 font-bold ml-2">💰 Budget Tracker</span>
      <ul class="flex gap-1.5">
        <li><NavLink to="/" text="Home" /></li>
        <li><NavLink to="/analysis" text="Analysis" /></li>
        <li><LogoutButton /></li>
      </ul>
    </div>
  </nav>
  <section class="bg-green-50 min-h-screen p-2">
    <div class="p-6">
      <div class="flex justify-between">
        <h1 class="font-bold text-green-600 text-3xl">Dashboard</h1>
        <button
          @click="refresh"
          class="px-4 py-2 rounded-xl font-medium bg-green-600 text-xl text-white hover:bg-green-400 transition"
        >
          Refresh
        </button>
      </div>
    </div>
    <div>
      <div v-if="loading" class="text-center py-10">Loading...</div>

      <div v-if="error" class="text-center py-10 text-red-500">{{ error }}</div>

      <div class="flex flex-col gap-3" v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            class="bg-white rounded-3xl p-5 shadow border-l-green-500 border-l-4"
          >
            <h3 class="text-xl text-gray-500">Income</h3>
            <p class="text-2xl font-bold text-green-600">
              ${{ summary.total_income || 0 }}
            </p>
          </div>
          <div
            class="bg-white rounded-3xl p-5 shadow border-l-red-500 border-l-4"
          >
            <h3 class="text-xl text-gray-500">Expense</h3>
            <p class="text-2xl font-bold text-red-600">
              ${{ summary.total_expense || 0 }}
            </p>
          </div>
          <div
            class="bg-white rounded-3xl p-5 shadow border-l-yellow-500 border-l-4"
          >
            <h3 class="text-xl text-gray-500">Balance</h3>
            <p class="text-2xl font-bold text-orange-400">
              ${{ summary.net_balance || 0 }}
            </p>
          </div>
        </div>
        <section class="bg-white rounded-3xl shadow p-5">
          <h2 class="text-xl font-bold mb-4">Add Transaction</h2>
          <form @submit.prevent="addTransaction">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Type</label
                >
                <select
                  v-model="newTransaction.type"
                  class="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Category</label
                >
                <select
                  v-model="newTransaction.category"
                  class="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select category</option>
                  <option value="rent">Rent</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Amount</label
                >
                <input
                  v-model="newTransaction.amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Date</label
                >
                <input
                  v-model="newTransaction.date"
                  type="date"
                  class="w-full px-5 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Descriptions</label
                >

                <input
                  v-model="newTransaction.description"
                  type="text"
                  class="w-full px-5 py-2 border rounded-lg"
                />
              </div>

              <div class="flex items-end">
                <button
                  type="submit"
                  class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
                >
                  Add
                </button>
              </div>
            </div>
          </form>

          <div v-if="inputError" class="text-red-500 text-sm mt-2">
            {{ inputError }}
          </div>
          <div v-if="inputSuccess" class="text-green-500 text-sm mt-2">
            {{ inputSuccess }}
          </div>
        </section>

        <section class="bg-white rounded-3xl shadow p-5">
          <h2 class="text-xl font-bold mb-4">Spending by Category</h2>

          <div
            v-if="categories.length === 0"
            class="text-gray-500 text-center py-4"
          >
            No data yet.
          </div>

          <div v-else>
            <div v-for="cat in categories" :key="cat.category" class="mb-3">
              <div class="flex justify-between items-center">
                <span class="font-medium capitalize">{{ cat.category }}</span>
                <span class="font-bold"
                  >${{ Number(cat.total).toFixed(2) }}</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  :style="{
                    width:
                      (Number(cat.total) / Number(summary.total_expense || 1)) *
                        100 +
                      '%',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </section>
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-3xl shadow p-7">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Recent Transactions</h2>
              <span class="text-xs text-gray-400"
                >{{ transactions.length }} total</span
              >
            </div>

            <div
              v-if="transactions.length === 0"
              class="text-gray-500 text-center py-4"
            >
              No transactions yet.
            </div>

            <div v-else>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs text-gray-400">{{
                  showDescription ? "Descriptions" : "Categories"
                }}</span>
                <button
                  @click="toggleView"
                  class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                >
                  {{ toggleLabel }}
                </button>
              </div>

              <div class="max-h-72 overflow-y-auto p-2">
                <div
                  v-for="item in transactions"
                  :key="item.id"
                  class="border-b p-2"
                >
                  <div
                    v-if="editId !== item.id"
                    class="flex justify-between items-center"
                  >
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{
                        getDisplayText(item)
                      }}</span>
                      <span
                        v-if="showDescription && !item.description"
                        class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded"
                      >
                        (no description)
                      </span>
                    </div>
                    <div class="flex items-center gap-2 p-2">
                      <div class="text-right mr-2">
                        <span
                          :class="
                            item.type === 'income'
                              ? 'text-green-400'
                              : 'text-red-500'
                          "
                        >
                          ${{ item.amount }}
                        </span>
                        <span class="text-gray-400 text-sm block">
                          {{ new Date(item.date).toLocaleDateString() }}
                        </span>
                      </div>
                      <button
                        @click="edit(item)"
                        class="text-blue-500 hover:text-blue-700 text-lg px-1"
                        title="Edit"
                      >
                        O
                      </button>
                      <button
                        @click="deleteTransaction(item.id)"
                        class="text-red-500 hover:text-red-700 text-lg px-1"
                        title="Delete"
                      >
                        X
                      </button>
                    </div>
                  </div>

                  <div
                    v-else
                    class="flex flex-wrap items-center gap-2 py-1 bg-gray-50 rounded-lg p-2"
                  >
                    <select
                      v-model="editData.type"
                      class="border rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>

                    <select
                      v-model="editData.category"
                      class="border rounded px-2 py-1 text-sm bg-white"
                    >
                      <option
                        v-for="cat in allowedCategories"
                        :key="cat"
                        :value="cat"
                      >
                        {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                      </option>
                    </select>

                    <input
                      v-model="editData.amount"
                      type="number"
                      step="0.01"
                      class="border rounded px-2 py-1 text-sm w-24 bg-white"
                      placeholder="Amount"
                    />

                    <input
                      v-model="editData.date"
                      type="date"
                      class="border rounded px-2 py-1 text-sm bg-white"
                    />

                    <input
                      v-model="editData.description"
                      type="text"
                      class="border rounded px-2 py-1 text-sm flex-1 min-w-[80px] bg-white"
                      placeholder="Description"
                    />

                    <button
                      @click="saveEdit(item.id)"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEdit"
                      class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
