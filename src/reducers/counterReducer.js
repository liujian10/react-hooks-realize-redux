const counterReducer = (state, action) => {
  switch(action.type) {
    case 'CHANGE_COUNT':
      return {
        ...state,
        count: action.payload
      }
    default:
      return state;
  }
};

export default counterReducer