import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../db";

// First, create the thunk
export const handleClick = createAsyncThunk("pendingLikes/click", async () => {
	const resultId = await db.streamIn.add({
		data: { testProp: "testValue" },
	});
	const result = await db.streamIn.where("id").equals(resultId).first();
	console.log({ result });
	console.log("test");
	return result;
});

export const pendingLikesSlice = createSlice({
	name: "pendingLikes",
	initialState: {
		value: 0,
	},
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		reset: () => {
			return { value: 0 };
		},
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(handleClick.fulfilled, (state) => {
			// Add user to the state array
			state.value += 1;
		});
	},
});

export const { increment, decrement, reset } = pendingLikesSlice.actions;

export default pendingLikesSlice.reducer;
