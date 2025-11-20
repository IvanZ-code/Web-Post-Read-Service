const API_URL = "https://localhost:44373/api";


export async function createUser(user) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return response.json();
}

export async function loginUser(credentials) {

    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            {
                Username: credentials.username,
                Password: credentials.password
            })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error:", errorText);
        return null;
    }

    return response.json();
}

export async function getUsers(search = "") {
    const url = search ? `${API_URL}/users?search=${encodeURIComponent(search)}` : `${API_URL}/users`;
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("GetUsers error:", errorText);
        return [];
    }

    return response.json();
}


export async function getPosts(userId) {
    const response = await fetch(`${API_URL}/posts?userId=${userId}`);
    return response.json();
}

export async function createPost(post) {
    const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
    });
    return response.json();
}
