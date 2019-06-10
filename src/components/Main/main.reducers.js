export default function MainReducer(state = {'wow': 'test'}, action) {
    switch(action.type) {
        case 'test':
            return {test: 'test'}
        
        default: 
            return state        
    }
}