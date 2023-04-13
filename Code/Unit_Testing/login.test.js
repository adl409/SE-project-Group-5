var Login = require('../Function_requirements/login');

test('Login information that exist in the database should result in true', async () => {
    expect(await Login.Login("wchen2654", "idk123")).toBe(true);
});

test('Username and password exist but doesn\'t match. Should result in false', async () => {
    expect(await Login.Login("adl409", "idk123")).toBe(false);
});

test('Username and password exist but doesn\'t match. Should result in false', async () => {
    expect(await Login.Login("WCHEN2654", "idk123")).toBe(false);
});

test('Password exist but username doesn\'t. Should result in false', async () => {
    expect(await Login.Login("random_username", "idk123")).toBe(false);
});

test('Login information exist in the database but is blocked. Should result in false', async () => {
    expect(await Login.Login("CoolDude", "asdf")).toBe(false);
});