import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*
"users": [
        {
            "id": 1,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 2,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 3,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 4,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 5,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 6,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 1,
            "failedLikes": 0
        },
        {
            "id": 7,
            "likeCount": 0,
            "status": 0,
            "successfulLikes": 0,
            "failedLikes": 0
        }
    ]
*/

export interface User {
    id: number;
    email: string;
}

export interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        value: initialState,
    },
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.value.user = action.payload;
        },
    },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
