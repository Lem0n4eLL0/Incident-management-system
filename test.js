const URL_API = 'http://localhost:8080';

async function fetchToken() {
  try {
    const response = await fetch(`${URL_API}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        login: 'admin',
        password: '1234',
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Token received:', data.access);
      return data.access; // Возвращаем токен
    } else {
      console.error('Failed to get token:', data);
      throw new Error('Authentication failed');
    }
  } catch (err) {
    console.error('Error during token fetch:', err);
    throw err; // Прокидываем ошибку
  }
}

async function fetchUserData(token) {
  try {
    const response = await fetch(`${URL_API}/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('User data received:', data);
      return data;
    } else {
      console.error('Failed to fetch user data:', await response.json());
      throw new Error('Failed to fetch user data');
    }
  } catch (err) {
    console.error('Error during user data fetch:', err);
    throw err; // Прокидываем ошибку
  }
}

async function main() {
  try {
    const token = await fetchToken();
    const userData = await fetchUserData(token);
  } catch (err) {
    console.error('Error in main function:', err);
  }
}

main();