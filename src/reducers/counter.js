const initState = {
    count: 0,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_COUNT':
            return {
                ...state,
                count: action.payload
            }
        default:
            return state;
    }
}

export { initState, reducer }
