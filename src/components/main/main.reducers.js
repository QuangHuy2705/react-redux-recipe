export const mainReducers = (action, state) => {
    switch (action.type) {
        case 'test':
            return {

            }
        default:
            return {
                test: 'test'
            }
    }
}