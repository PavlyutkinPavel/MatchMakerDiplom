import api from "api";

const team = (set, get) => ({
    team: {
        list: [],
        current: null,
        error: null,

        // Получить все команды
        fetchAll: async () => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'team', text: 'Loading teams...' });

            try {
                const response = await api.get('/team');
                set({
                    team: {
                        ...get().team,
                        list: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    team: {
                        ...get().team,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('team');
            }
        },

        // Создать команду
        create: async (teamData) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Creating team...' });

            try {
                const response = await api.post('/team', teamData);
                set(state => ({
                    team: {
                        ...state.team,
                        error: null
                    }
                }));
                return response.data;
            } catch (err) {
                set(state => ({
                    team: {
                        ...state.team,
                        error: err.response?.data?.message || err.message
                    }
                }));
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Обновить команду
        update: async (updatedData) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: `Updating team #${updatedData.id}...` });

            try {
                const response = await api.put(`/team`, updatedData);
                set(state => ({
                    team: {
                        ...state.team,
                        current: response.data,
                        error: null
                    }
                }));
                return response.data;
            } catch (err) {
                set(state => ({
                    team: {
                        ...state.team,
                        error: err.response?.data?.message || err.message
                    }
                }));
                throw err;
            } finally {
                hideLoader();
            }
        },

        // Удалить команду
        delete: async (id) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'team', text: 'Deleting team...' });

            try {
                await api.delete(`/team/${id}`);
                set(state => ({
                    team: {
                        ...state.team,
                        error: null
                    }
                }));
            } catch (err) {
                set(state => ({
                    team: {
                        ...state.team,
                        error: err.response?.data?.message || err.message
                    }
                }));
                throw err;
            } finally {
                hideLoader('team');
            }
        },

        // Получить команду по ID
        getById: async (id) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Loading team details...' });

            try {
                const response = await api.get(`/team/${id}`);
                set({
                    team: {
                        ...get().team,
                        current: response.data,
                        error: null
                    }
                });
                return response.data;
            } catch (err) {
                set({
                    team: {
                        ...get().team,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader();
            }
        },

        getTeamMember: async (id) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'team', text: 'Loading team member...' });

            try {
                const response = await api.get(`/team/member/${id}`);
                return response.data;
            } catch (err) {
                set({
                    team: {
                        ...get().team,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('team');
            }
        },


        getTeamMembers: async (teamId) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ moduleName: 'team', text: 'Loading team member...' });

            try {
                const response = await api.get(`/team/members/team/${teamId}`);
                return response.data;
            } catch (err) {
                set({
                    team: {
                        ...get().team,
                        error: err.response?.data?.message || err.message
                    }
                });
                throw err;
            } finally {
                hideLoader('team');
            }
        },

        // Добавить участника команды
        addMember: async (userTeamRelationDTO) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Adding team member...' });
            try {
                const response = await api.post(`/team/member`, userTeamRelationDTO);
                set(state => ({
                    team: {
                        ...state.team,
                        error: null
                    }
                }));
                return response.data;
            } catch (err) {
                set(state => ({
                    team: {
                        ...state.team,
                        error: err.response?.data?.message || err.message
                    }
                }));
                throw err;
            } finally {
                hideLoader();
            }
        },


        //под вопросом
        removeMember: async (teamId, userId) => {
            const { showLoader, hideLoader } = get().loader;
            showLoader({ text: 'Removing team member...' });

            try {
                const response = await api.delete(`/team/${teamId}/members/${userId}`);
                set(state => ({
                    team: {
                        ...state.team,
                        current: response.data,
                        error: null
                    }
                }));
                return response.data;
            } catch (err) {
                set(state => ({
                    team: {
                        ...state.team,
                        error: err.response?.data?.message || err.message
                    }
                }));
                throw err;
            } finally {
                hideLoader();
            }
        },
    }
});

export default team;