const loader = (set) => ({
  loader: {
    global: {
      isLoading: false,
      text: 'Loading...'
    },

    modules: {
      event: { isLoading: false, text: 'Loading Events...' },
      singleEvent: { isLoading: false, text: 'Loading Basic Events...' },
      auth: { isLoading: false, text: 'Loading...' }
    },

    // Показать лоадер
    showLoader: (options = {}) => {
      const { moduleName, text } = options;

      set(state => {
        if (!moduleName) {
          return {
            loader: {
              ...state.loader,
              global: {
                isLoading: true,
                text: text || state.loader.global.text
              }
            }
          };
        } else {
          return {
            loader: {
              ...state.loader,
              modules: {
                ...state.loader.modules,
                [moduleName]: {
                  isLoading: true,
                  text: text || ''
                }
              }
            }
          };
        }
      });
    },

    // Скрыть лоадер
    hideLoader: (moduleName) => {
      set(state => {
        if (!moduleName) {
          return {
            loader: {
              ...state.loader,
              global: {
                isLoading: false,
                text: ''
              }
            }
          };
        } else {
          return {
            loader: {
              ...state.loader,
              modules: {
                ...state.loader.modules,
                [moduleName]: {
                  isLoading: false,
                  text: ''
                }
              }
            }
          };
        }
      });
    }
  }
});

export default loader;