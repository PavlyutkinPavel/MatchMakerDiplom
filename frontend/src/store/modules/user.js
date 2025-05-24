import api from "api";

const user = (set, get) => ({
  user: {
    list: [],
    current: null,
    error: null,

    // Получить всех пользователей
    fetchAll: async () => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'user', text: 'Loading users...' });

      try {
        const response = await api.get('/user');
        set({
          user: {
            ...get().user,
            list: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          user: {
            ...get().user,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('user');
      }
    },

    // Создать пользователя
    create: async (userData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Creating user...' });

      try {
        const response = await api.post('/user', userData);
        set(state => ({
          user: {
            ...state.user,
            error: null
          }
        }));
        return response.data;
      } catch (err) {
        set(state => ({
          user: {
            ...state.user,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Обновить пользователя
    update: async (id, updatedData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: `Updating user #${id}...` });

      try {
        const response = await api.put(`/user/${id}`, updatedData);
        set(state => ({
          user: {
            ...state.user,
            error: null
          }
        }));
        return response.data;
      } catch (err) {
        set(state => ({
          user: {
            ...state.user,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Удалить пользователя
    delete: async (id) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'user', text: 'Deleting user...' });

      try {
        await api.delete(`/user/${id}`);
        set(state => ({
          user: {
            ...state.user,
            error: null
          }
        }));
      } catch (err) {
        set(state => ({
          user: {
            ...state.user,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader('user');
      }
    },

    // Получить пользователя по ID
    getById: async (id) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Loading user details...' });

      try {
        const response = await api.get(`/user/${id}`);
        set({
          user: {
            ...get().user,
            current: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          user: {
            ...get().user,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Изменить пароль пользователя
    changePassword: async (userId, newPassword) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Changing password...' });

      try {
        const response = await api.put(`/user/${userId}/password`, { newPassword });
        return response.data;
      } catch (err) {
        set(state => ({
          user: {
            ...state.user,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Поиск пользователей
    searchUsers: async (query) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'user', text: 'Searching users...' });

      try {
        const response = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
        set(state => ({
          user: {
            ...state.user,
            error: null
          }
        }));
        return response.data;
      } catch (err) {
        set(state => ({
          user: {
            ...state.user,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader('user');
      }
    }
  }
});

export default user;