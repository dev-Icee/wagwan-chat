import { apiSlice } from "./apiSlice";
const USER_URL = "/api/v1/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: data => ({ url: `${USER_URL}/login`, method: "POST", body: data })
    })
  })
});

export const { useLoginMutation } = usersApiSlice;
