import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  dialogIsClosed: boolean; // ✅ Renamed for better readability
  filterText: string;
  filters: Record<string, { type: string; value: any }>;
}

const initialState: FilterState = {
  dialogIsClosed: false,
  filterText: "",
  filters: {},
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilterText: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Record<string, { type: string; value: any }>>
    ) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filterText = "";
      state.filters = {};
    },
      toggleDialog: (state, action: PayloadAction<boolean>) => {
      state.dialogIsClosed = action.payload;
    },
  },
});

export const { setFilterText, setFilters, resetFilters, toggleDialog } = filterSlice.actions;

export default filterSlice.reducer;
