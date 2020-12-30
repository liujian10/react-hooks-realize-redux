const initState = {
    text: 'old',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_TEXT':
            return {
                ...state,
                text: action.payload
            }
        default:
            return state;
    }
}

export { initState, reducer }
