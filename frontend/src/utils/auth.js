import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const useAuth = () => {
  const router = useRouter();
  const storedUser = localStorage.getItem("user");
  const token = ref(localStorage.getItem("token"));
  const user = ref(storedUser ? JSON.parse(storedUser) : null);

  const isLogIn = computed(() => !!token.value);

  const checkAuth = () => {
    token.value = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    user.value = storedUser ? JSON.parse(storedUser) : null;
  };
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    token.value = newToken;
    user.value = userData;
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    token.value = null;
    user.value = null;
    router.push("/login");
  };
  let storageListener = null;

  onMounted(() => {
    storageListener = window.addEventListener("storage", checkAuth);
  });

  onUnmounted(() => {
    if (storageListener) {
      window.removeEventListener("storage", checkAuth);
    }
  });
  return { token, user, isLogIn, checkAuth, login, logout };
};

export default useAuth;
