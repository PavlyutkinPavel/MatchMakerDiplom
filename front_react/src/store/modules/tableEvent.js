import api from 'api';

const tableEvent = (set, get) => ({
    tableEvent: {
        list: [],
        current: null,
        teams: [],
        error: null,

        // Получить все table events
        fetchAll: async () => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'tableEvent', text: 'Loading table events...' });

            try {
                const response = await api.get('/table-event');
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        list: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('tableEvent');
            }
        },

        // Получить table event по ID
        fetchById: async (id) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Loading table event...' });

            try {
                const response = await api.get(`/table-event/${id}`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        current: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Создать table event
        create: async (eventData) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Creating table event...' });

            try {
                const response = await api.post('/table-event', eventData);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        list: [...get().tableEvent.list, response.data],
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Обновить table event
        update: async (id, updatedData) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: `Updating table event #${id}...` });

            try {
                const response = await api.put(`/table-event/${id}`, updatedData);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        list: get().tableEvent.list.map(event =>
                            event.id === id ? response.data : event
                        ),
                        current: get().tableEvent.current?.id === id ? response.data : get().tableEvent.current,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Удалить table event
        delete: async (id) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'tableEvent', text: 'Deleting table event...' });

            try {
                await api.delete(`/table-event/${id}`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        list: get().tableEvent.list.filter(event => event.id !== id),
                        current: get().tableEvent.current?.id === id ? null : get().tableEvent.current,
                        error: null
                    }
                });
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('tableEvent');
            }
        },

        // Получить команды в table event
        fetchTeams: async (eventId) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'tableEvent', text: 'Loading teams...' });

            try {
                const response = await api.get(`/table-event/${eventId}/teams`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        teams: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('tableEvent');
            }
        },

        // Добавить команду в table event
        addTeam: async (eventId, teamId) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Adding team...' });

            try {
                const response = await api.post(`/table-event/${eventId}/team/${teamId}`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        teams: [...get().tableEvent.teams, response.data],
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Удалить команду из table event
        removeTeam: async (eventId, teamId) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Removing team...' });

            try {
                await api.delete(`/table-event/${eventId}/team/${teamId}`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        teams: get().tableEvent.teams.filter(team => team.id !== teamId),
                        error: null
                    }
                });
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Обновить статистику команды
        updateTeamStats: async (eventId, teamId, stats) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Updating team stats...' });

            try {
                const response = await api.put(`/table-event/${eventId}/team/${teamId}/stats`, null, {
                    params: {
                        points: stats.points,
                        wins: stats.wins,
                        losses: stats.losses,
                        draws: stats.draws
                    }
                });

                set({
                    tableEvent: {
                        ...get().tableEvent,
                        teams: get().tableEvent.teams.map(team =>
                            team.teamId === teamId ? { ...team, ...response.data } : team
                        ),
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Получить table events по статусу
        fetchByStatus: async (status) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'tableEvent', text: `Loading ${status} events...` });

            try {
                const response = await api.get(`/table-event/status?status=${status}`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        list: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('tableEvent');
            }
        },

        // Получить table events команды
        fetchByTeam: async (teamId) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'tableEvent', text: 'Loading team events...' });

            try {
                const response = await api.get(`/table-event/team/${teamId}`);
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        list: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    tableEvent: {
                        ...get().tableEvent,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('tableEvent');
            }
        }
    }
});

export default tableEvent;