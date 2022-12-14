import reducer from './user';

describe('user reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      users: [],
      loggedInUser: null,
      selectedUser: null,
    });
  });
});
