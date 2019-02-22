import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialState = {
  events: [],
  loading: false,
  currentEvent: {},
  selectedIndex: 0
}

const fetchEventsStart = (state, action) => {
  return updateObject(state, { loading: true })
}

const fetchEventsSuccess = (state, action) => {
  return updateObject(state, {
    events: action.events,
    currentEvent: action.currentEvent,
    loading: false
  })
}

const fetchEventsFail = (state, action) => {
  return updateObject(state, { loading: false })
}

const updateCurrentEvent = (state, action) => {
  return updateObject(state, { currentEvent: action.currentEvent, selectedIndex: action.selectedIndex })
}

const updateAllEvents = (state, action) => {
  return updateObject(state, { events: action.events })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_START: return fetchEventsStart(state, action)
    case actionTypes.FETCH_EVENTS_SUCCESS: return fetchEventsSuccess(state, action)
    case actionTypes.FETCH_EVENTS_FAIL: return fetchEventsFail(state, action)
    case actionTypes.UPDATE_CURRENT_EVENT: return updateCurrentEvent(state, action)
    case actionTypes.UPDATE_ALL_EVENTS: return updateAllEvents(state, action)
    default: return state
  }
}

export default reducer
