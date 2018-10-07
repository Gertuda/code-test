const defaultState = {title: '', start: '', duration: ''}

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'ADD_INPUTS':
            const inputs = action.inputs
            if (inputs) {
                return inputs
            }
                return defaultState
        default: 
            return state;
    }
}

