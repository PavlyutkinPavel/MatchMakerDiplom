// fetchAll() - Получить все события
// create(eventData) - Создать событие
// update(id, updatedData) - Обновить событие по ID
// delete(id) - Удалить событие по ID
// getById(id) - Получить событие по ID
// fetchByType(eventType) - Получить события по типу

import api from 'api';

const event = (set, get) => ({
  event: {
    list: [],
    current: null,
    error: null,

    // Получить события по типу
    fetchByType: async (eventType) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'event', text: `Loading ${eventType} events...` });

      try {
        const response = await api.get(`/event/type?eventType=${eventType}`);
        set({
          event: {
            ...get().event,
            list: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          event: {
            ...get().event,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('event');
      }
    },

    // Получить все события
    fetchAll: async () => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'event', text: 'Loading events...' });

      try {
        const response = await api.get('/event');
        set({
          event: {
            ...get().event,
            list: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          event: {
            ...get().event,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('event');
      }
    },

    // Создать событие
    create: async (eventData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Creating event...' });

      try {
        const response = await api.post('/event', eventData);
        set(state => ({
          event: {
            ...state.event,
            error: null
          }
        }));
        return response.data;
      } catch (err) {
        set(state => ({
          event: {
            ...state.event,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Обновить событие
    update: async (id, updatedData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: `Updating event #${id}...` });

      try {
        const response = await api.put(`/event/${id}`, updatedData);
        set(state => ({
          event: {
            ...state.event,
            error: null
          }
        }));
        return response.data;
      } catch (err) {
        set(state => ({
          event: {
            ...state.event,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Удалить событие
    delete: async (id) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'event', text: 'Deleting event...' });

      try {
        await api.delete(`/event/${id}`);
        set(state => ({
          event: {
            ...state.event,
            error: null
          }
        }));
      } catch (err) {
        set(state => ({
          event: {
            ...state.event,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader('event');
      }
    },

    // Получить событие по ID
    getById: async (id) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Loading event details...' });

      try {
        const response = await api.get(`/event/${id}`);
        set({
          event: {
            ...get().event,
            current: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          event: {
            ...get().event,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    }
  }
});

export default event;