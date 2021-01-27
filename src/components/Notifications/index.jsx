import { useReducer } from 'react';
import {
  Breadcrumb,
} from 'react-bootstrap';

import { NotificationContext } from './notificationsContext';
import NotificationOptions from './Options';
import NotificationMain from './Main';

const initialState = {
  notificationType: 'Notifications', // SMS or app notificationa
  customerList: [], // List of customers
  customerSelected: [], // List of selected customers
  message: '', // Actual message
  history: {
    open: false, // If history modal is opened, when implemented
    messages: [], // List of messages in history modal when implemented
  },
  group: {
    open: false, // If customer group modal is opened
    saved: [], // List of customer groups
  },
  savedMessages: {
    open: false, // If saved messages modal is opened
    saved: [], // List of saved messages
  },
}

function reducer(state,action) {
  switch(action.type) {
    case 'SWITCH_NOTIFICATION_TYPE':
      return {
        ...state,
        notificationType: action.payload,
      }
    case 'FETCH_CUSTOMERS':
      return {
        ...state,
        customerList: action.payload,
      }
    case 'SELECT_CUSTOMERS':
      return {
        ...state,
        customerSelected: action.payload,
      }
    case 'EDIT_MESSAGE':
      return {
        ...state,
        message: action.payload,
      }
    case 'TOGGLE_HISTORY_MODAL':
      return {
        ...state,
        history: {
          ...state.history,
          open: !state.history.open
        }
      }
    case 'FETCH_HISTORY':
      return {
        ...state,
        history: {
          ...state.history,
          messages: action.payload
        }
      }
    case 'TOGGLE_GROUP_MODAL':
      return {
        ...state,
        group: {
          ...state.group,
          open: !state.group.open
        }
      }
    case 'TOGGLE_MESSAGE_MODAL':
      return {
        ...state,
        savedMessages: {
          ...state.savedMessages,
          open: !state.savedMessages.open
        }
      }
    default:
      return state
  }
}

function Notifications() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="/"> Admin Site </Breadcrumb.Item>
          <Breadcrumb.Item active> Notifications </Breadcrumb.Item>
        </Breadcrumb>
        <NotificationOptions
          state={state}
          dispatch={dispatch}
        />
        <NotificationMain
          state={state}
          dispatch={dispatch}
        />
      </div>
    </NotificationContext.Provider>
  )
}

export default Notifications;
