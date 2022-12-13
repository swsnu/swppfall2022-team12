import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import reducer, { UserState } from './user';

describe("user reducer", () => {
  let store: EnhancedStore<
    { user: UserState },
    AnyAction,
    [ThunkMiddleware<{ user: UserState }, AnyAction, undefined>]
  >;

  beforeAll(() => {
    store = configureStore({ reducer: { user: reducer } });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle initial state", () => {
    expect(reducer(undefined, { type : 'unknown' })).toEqual({
      users: [],
      loggedInUser: null,
      selectedUser: null,
    });})
})