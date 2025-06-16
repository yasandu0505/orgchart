import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    gazetteData: []
}

const gazetteSlice = createSlice({
    name: 'gazettes',
    initialState,
    reducers: {
        setGazetteData(state, action){
            state.gazetteData = action.payload;
        }
    }
})

export const {setGazetteData} = gazetteSlice.actions;
export default gazetteSlice.reducer;