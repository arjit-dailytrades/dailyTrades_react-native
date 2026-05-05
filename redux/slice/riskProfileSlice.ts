import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface QuizOption {
  value: string;
  label: string;
  displayValue: string;
  description: string;
  score: number;
  weighted: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export type QuizAnswers = Record<string, Record<string, string>>;

// API response type
interface QuestionsResponse {
  data: QuizSection[];
}

interface RiskProfileState {
  questions: QuizSection[];
  answers: QuizAnswers;
  questionLoading: boolean;
  answerLoading: boolean;
}

const initialState: RiskProfileState = {
  questions: [],
  answers: {},
  questionLoading: false,
  answerLoading: false,
};

export const getQuestions = createAsyncThunk<QuestionsResponse>(
  "riskProfile/getQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/risk-profile/get-question`, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch question");
    }
  },
);

export const getAnswer = createAsyncThunk<QuizAnswers>(
  "riskProfile/getAnswer",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/risk-profile/get-answers`, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch answer");
    }
  },
);

const riskProfileSlice = createSlice({
  name: "riskProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Questions
      .addCase(getQuestions.pending, (state) => {
        state.questionLoading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.questionLoading = false;
        state.questions = action.payload.data;
      })
      .addCase(getQuestions.rejected, (state) => {
        state.questionLoading = false;
      })

      // Answers
      .addCase(getAnswer.pending, (state) => {
        state.answerLoading = true;
      })
      .addCase(getAnswer.fulfilled, (state, action) => {
        state.answerLoading = false;
        state.answers = action.payload;
      })
      .addCase(getAnswer.rejected, (state) => {
        state.answerLoading = false;
      });
  },
});

export default riskProfileSlice.reducer;
