import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { ThunkMiddleware } from 'redux-thunk';
import reducer, { fetchTags, TagState, TagType } from './tag';

describe('tag reducer', () => {
  let store: EnhancedStore<
    { tag: TagState },
    AnyAction,
    [ThunkMiddleware<{ tag: TagState }, AnyAction, undefined>]
  >;

  const mockTags: TagType[] = [
    {
      id: 1,
      content: 'test-tag1',
    },
    {
      id: 2,
      content: 'test-tag2',
    },
  ];

  beforeAll(() => {
    store = configureStore({ reducer: { tag: reducer } });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      tags: [],
      selectedTags: [],
    });
  });

  it('should handle fetchTags', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockTags });
    await store.dispatch(fetchTags());
    expect(store.getState().tag.tags).toEqual(mockTags);
  });
});
