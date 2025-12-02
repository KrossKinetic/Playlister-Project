const axios = require('axios');

const testUser = {
    username: "TestUser",
    email: "testuser" + Date.now() + "@example.com",
    password: "password123",
    passwordVerify: "password123",
    avatarPng: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
};

async function verifyAvatar() {
    try {
        console.log("Registering user...");
        const response = await axios.post('http://localhost:4000/auth/register', testUser);

        if (response.status === 200 && response.data.success) {
            console.log("Registration successful!");
            if (response.data.user.avatarPng === testUser.avatarPng) {
                console.log("Avatar verification PASSED: Avatar matches sent data.");
            } else {
                console.error("Avatar verification FAILED: Avatar does not match.");
                console.log("Expected:", testUser.avatarPng);
                console.log("Received:", response.data.user.avatarPng);
                process.exit(1);
            }

            if (response.data.user.username === testUser.username) {
                console.log("Username verification PASSED: Username matches sent data.");
            } else {
                console.error("Username verification FAILED: Username does not match.");
                console.log("Expected:", testUser.username);
                console.log("Received:", response.data.user.username);
                process.exit(1);
            }
        } else {
            console.error("Registration failed:", response.data);
            process.exit(1);
        }
    } catch (error) {
        console.error("Error during verification:", error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyAvatar();
