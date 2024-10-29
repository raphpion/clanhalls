import User from '../../src/users/user';

describe('User', () => {
  it('normalizes emails adequately', () => {
    expect(User.normalizeEmail('jOHn.dOe@gmaIL.com')).toBe(
      'john.doe@gmail.com',
    );
  });

  it('normalizes usernames adequately', () => {
    expect(User.normalizeUsername('JoHn Doe')).toBe('john doe');
  });

  it('changes email if it is valid', () => {
    const user = new User();
    expect(() => user.changeEmail('john.doe@gmail.com')).not.toThrow();
    expect(user.email).toBe('john.doe@gmail.com');
  });

  it('changes the picture url if it is valid', () => {
    const user = new User();
    expect(() => user.setPictureUrl('https://example.com/')).not.toThrow();
    expect(user.pictureUrl).toBe('https://example.com/');
  });

  it('sets the username if it is not already set', () => {
    const user = new User();
    expect(() => user.setUsername('John Doe')).not.toThrow();
    expect(user.username).toBe('John Doe');
    expect(user.usernameNormalized).toBe(User.normalizeUsername('John Doe'));
  });

  it('verifies the email if it is not already verified', () => {
    const user = new User();
    expect(() => user.verifyEmail()).not.toThrow();
    expect(user.emailVerified).toBe(true);
  });

  it('throws an error when changing email to an invalid one', () => {
    const user = new User();
    expect(() => user.changeEmail('invalid')).toThrow();
    expect(() => user.changeEmail('invalid@')).toThrow();
    expect(() => user.changeEmail('invalid.com')).toThrow();
  });

  it('throws an error when setting a picture URL to an invalid one', () => {
    const user = new User();
    expect(() => user.setPictureUrl('invalid')).toThrow();
    expect(() => user.setPictureUrl('invalid.com')).toThrow();
  });

  it('throws an error when setting a username if it is already set', () => {
    const user = new User();
    user.setUsername('john_doe');
    expect(() => user.setUsername('jane_doe')).toThrow();
  });

  it('throws an error when verifying an already verified email', () => {
    const user = new User();
    user.emailVerified = true;
    expect(() => user.verifyEmail()).toThrow();
  });
});
