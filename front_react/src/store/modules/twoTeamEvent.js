import api from 'api';

const twoTeamEvent = (set, get) => ({
  twoTeamEvent: {
    list: [],
    current: null,
    error: null,

    fetchAll: async () => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'twoTeamEvent', text: 'Loading two-team events...' });

      try {
        const response = await api.get('/two-team-event');
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            list: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('twoTeamEvent');
      }
    },

    fetchById: async (eventId) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Loading two-team event details...' });

      try {
        const response = await api.get(`/two-team-event/${eventId}`);
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            current: response.data,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    create: async (eventData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: 'Creating two-team event...' });

      try {
        const response = await api.post('/two-team-event', eventData);
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            list: [...get().twoTeamEvent.list, response.data],
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    update: async (eventId, updatedData) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: `Updating two-team event #${eventId}...` });

      try {
        const response = await api.put(`/two-team-event/${eventId}`, updatedData);
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            list: get().twoTeamEvent.list.map(event =>
              event.id === eventId ? response.data : event
            ),
            current: get().twoTeamEvent.current?.id === eventId ? response.data : get().twoTeamEvent.current,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    updateScores: async (eventId, scores) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ text: `Updating scores for event #${eventId}...` });

      try {
        const response = await api.put(`/two-team-event/${eventId}/scores`, scores);
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            list: get().twoTeamEvent.list.map(event =>
              event.id === eventId ? { ...event, ...response.data } : event
            ),
            current: get().twoTeamEvent.current?.id === eventId 
              ? { ...get().twoTeamEvent.current, ...response.data } 
              : get().twoTeamEvent.current,
            error: null
          }
        });
        return response.data;
      } catch (err) {
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader();
      }
    },

    delete: async (eventId) => {
      const { showLoader, hideLoader } = get().loader;
      showLoader({ moduleName: 'twoTeamEvent', text: 'Deleting two-team event...' });

      try {
        await api.delete(`/two-team-event/${eventId}`);
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            list: get().twoTeamEvent.list.filter(event => event.id !== eventId),
            current: get().twoTeamEvent.current?.id === eventId ? null : get().twoTeamEvent.current,
            error: null
          }
        });
      } catch (err) {
        set({
          twoTeamEvent: {
            ...get().twoTeamEvent,
            error: err.response?.data?.message || err.message
          }
        });
        throw err;
      } finally {
        hideLoader('twoTeamEvent');
      }
    }
  }
});

export default twoTeamEvent;