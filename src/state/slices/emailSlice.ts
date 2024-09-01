import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import writeEvent from '../../writeEvent';

export const emailSlice = createSlice({
    name: 'email',
    initialState: {
        value: '',
    },
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const requestAuthorization =
    (email: string) => async (dispatch: Dispatch) => {
        await writeEvent('user-login-intended', {
            timestamp: new Date().toISOString(),
            user: {
                email: email,
            },
        });
        dispatch(emailSlice.actions.setEmail(email));
    };

export default emailSlice.reducer;
