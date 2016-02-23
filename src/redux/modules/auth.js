const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const REGISTER = 'redux-example/auth/REGISTER';
const REGISTER_SUCCESS = 'redux-example/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'redux-example/auth/REGISTER_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';
const RELOADING = 'redux-example/auth/RELOADING';
const RELOAD_SUCCESS = 'redux-example/auth/RELOAD_SUCCESS';
const RELOAD_FAIL = 'redux-example/auth/RELOAD_FAIL';
const CHANGE_TAB = 'redux-example/auth/CHANGE_TAB';
const DESTROY = 'redux-example/auth/DESTROY';

const SEND_SUCCESS = 'redux-example/send/SEND_SUCCESS';
const WS_PAYMENT = 'redux-example/ws/PAYMENT';

const initialState = {
  loaded: false,
  fail: {},
  activeTab: 'login'
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        fail: action.error
      };
    case REGISTER:
      return {
        ...state,
        registering: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        user: action.result
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registering: false,
        user: null,
        fail: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case SEND_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          balance: state.user.balance - action.result.source_amount
        }
      };
    case WS_PAYMENT:
      return {
        ...state,
        user: {
          ...state.user,
          balance: Number(state.user.balance) + Number(action.result.destination_amount)
        }
      };
    case CHANGE_TAB:
      return {
        ...state,
        activeTab: action.tab
      };
    // TODO Handle RELOADING and RELOAD_FAIL
    case RELOAD_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          balance: action.result.balance
        }
      };
    case DESTROY:
      return {
        ...state,
        fail: {}
      };
    default:
      return state;
  }
}

export function changeTab(tab) {
  return {
    type: CHANGE_TAB,
    tab: tab
  };
}

export function unmount() {
  return {
    type: DESTROY
  };
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/auth/load')
  };
}

export function login(fields) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/auth/login', {
      data: {
        username: fields.username,
        password: fields.password
      }
    })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/auth/logout')
  };
}

export function register(fields) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: (client) => client.post('/auth/register', {
      data: {
        username: fields.username,
        password: fields.password
      }
    })
  };
}

export function reload(opts) {
  return {
    types: [RELOADING, RELOAD_SUCCESS, RELOAD_FAIL],
    promise: (client) => client.post('/users/' + opts.username + '/reload')
  };
}

// TODO separate module for WS stuff?
export function payment(data) {
  return (dispatch, getState) => {
    const duplicate = getState().history.history.filter((item) => {
      return item.id === data.id;
    })[0];

    if (duplicate) return false;

    return dispatch({
      type: WS_PAYMENT,
      result: data
    });
  };
}
