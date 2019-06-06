export default function MainReducer(state = {test: 'test'}, action) {
    switch(action.type) {
        case 'test':
            return {test: 'test'}
        
        default: 
            return state        
    }
}