import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
// utils
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../config';
import axios from '../utils/axios';
//
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'RELOAD') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      if (token && accessToken && isValidToken(accessToken)) {
        setSession(token, accessToken);

        const response = await axios.post('/api/user', {
          credential: accessToken,
        });

        const { userId } = response.data;
        const user = await getUser(userId);

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // GET USER
  const getUser = async (userId) => {
    const response = await axios.get(`/api/user/${userId}`);

    return response.data;
  };

  // LOGIN
  const loginWithCredential = async (credential) => {
    const response = await axios.post('/api/user', {
      credential,
    });

    const { userId } = response.data;
    const user = await getUser(userId);
    const { token } = user;

    setSession(token, credential);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  // REGISTER
  const studentRegister = async (userId, studentNum, departmentId) => {
    const response = await axios.post(`/api/user/student`, {
      userId,
      studentNum,
      departmentId,
    });
    const user = response.data;

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const otherRegister = async (userId, affiliation) => {
    const response = await axios.post(`/api/user/other`, {
      userId,
      affiliation,
    });
    const user = response.data;

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  // RELOAD
  const reloadUser = async (userId) => {
    const user = await getUser(userId);

    dispatch({
      type: 'RELOAD',
      payload: {
        user,
      },
    });
  };

  // LOGOUT
  const logout = async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          ...state,
          method: 'jwt',
          loginWithCredential,
          studentRegister,
          otherRegister,
          reloadUser,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
