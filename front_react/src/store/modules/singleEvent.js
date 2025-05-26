// create(eventData) - Создать single-event
// fetchAll() - Получить все single-event
// update(id, updatedData) - Обновить single-event
// fetchById(id) - Получить single-event
// delete(id) - Удалить single-event
// fetchParticipants(eventId) - Получить участников single-event

import api from "api";

const singleEvent = (set, get) => ({
  singleEvent: {
    list: [],
    current: null,
    error: null,
    participants: [],

        // Обновить статус участника события
    updateParticipantStatus: async (eventId, userId, statusData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ 
        moduleName: 'event',
        text: `Updating participant #${userId} status...`
      });

      try {
        const response = await api.put(
          `/single-event/${eventId}/participant/${userId}`,
          statusData
        );
        
        // Обновляем текущее событие если оно активно
        const currentEvent = get().event.current;
        if (currentEvent && currentEvent.id === eventId) {
          set({
            event: {
              ...get().event,
              current: {
                ...currentEvent,
                participants: currentEvent.participants?.map(p => 
                  p.user.id === userId ? { ...p, ...statusData } : p
                ),
              },
              error: null
            }
          });
        }
        
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
    
    addParticipants: async (eventId, userIds) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Adding participants...' });

      try {
        const response = await api.post(`/single-event/${eventId}/participants`, { userIds });
        set(state => ({
          singleEvent: {
            ...state.singleEvent,
            current: response.data,
            error: null
          }
        }));
        return response.data;
      } catch (err) {
        set(state => ({
          singleEvent: {
            ...state.singleEvent,
            error: err.response?.data?.message || err.message
          }
        }));
        throw err;
      } finally {
        hideLoader();
      }
    },
    // Удалить участника из события
    removeParticipant: async (eventId, userId) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({
        moduleName: 'singleEvent',
        text: `Removing participant #${userId}...`
      });

      try {
        await api.delete(`/single-event/${eventId}/participant/${userId}`);

        set({
          singleEvent: {
            ...get().singleEvent,
            participants: get().singleEvent.participants.filter(
              p => p.user.id !== userId
            ),
            error: null
          }
        });
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('singleEvent');
      }
    },

    // Получить участников события
    fetchParticipants: async (eventId) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({
        moduleName: 'singleEvent',
        text: `Loading participants for event #${eventId}...`
      });

      try {
        const response = await api.get(`/single-event/${eventId}/participants`);
        set({
          singleEvent: {
            ...get().singleEvent,
            participants: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('singleEvent');
      }
    },

    // Создать событие
    create: async (eventData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Creating single event...' });

      try {
        const response = await api.post('/single-event', eventData);
        set({
          singleEvent: {
            ...get().singleEvent,
            list: [...get().singleEvent.list, response.data],
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Получить все события
    fetchAll: async () => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'singleEvent', text: 'Loading single events...' });

      try {
        const response = await api.get('/single-event');
        set({
          singleEvent: {
            ...get().singleEvent,
            list: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('singleEvent');
      }
    },

    // Обновить событие
    update: async (id, updatedData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: `Updating single event #${id}...` });

      try {
        const response = await api.put(`/single-event/${id}`, updatedData);
        set({
          singleEvent: {
            ...get().singleEvent,
            list: get().singleEvent.list.map(event =>
              event.id === id ? response.data : event
            ),
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Получить событие по ID
    fetchById: async (id) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Loading single event details...' });

      try {
        const response = await api.get(`/single-event/${id}`);
        set({
          singleEvent: {
            ...get().singleEvent,
            current: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    // Удалить событие
    delete: async (id) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'singleEvent', text: 'Deleting single event...' });

      try {
        await api.delete(`/single-event/${id}`);
        set({
          singleEvent: {
            ...get().singleEvent,
            list: get().singleEvent.list.filter(event => event.id !== id),
            error: null
          }
        });
      } catch (err) {
        set({
          singleEvent: {
            ...get().singleEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('singleEvent');
      }
    }
  }
});

export default singleEvent;