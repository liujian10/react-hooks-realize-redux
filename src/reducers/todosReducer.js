const todosReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_TEXT':
            return {
                ...state,
                text: action.payload
            }
        default:
            return state;
    }
};

export default todosReducer
