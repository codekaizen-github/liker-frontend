import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TotalOrderIdState {
    value: number | undefined;
}
const initialState: TotalOrderIdState = {
    value: undefined,
};
export const totalOrderIdSlice = createSlice({
    name: 'totalOrderId',
    initialState,
    reducers: {
        setId: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
    },
});

export const { setId } = totalOrderIdSlice.actions;
export default totalOrderIdSlice.reducer;
