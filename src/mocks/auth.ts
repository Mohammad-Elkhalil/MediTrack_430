interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'patient@example.com',
    role: 'patient',
  },
  {
    id: '2',
    name: 'Dr. Smith',
    email: 'doctor@example.com',
    role: 'doctor',
  },
];

export const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, we would verify the password here
    if (password !== 'password123') {
      throw new Error('Invalid password');
    }

    return user;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'patient' | 'doctor';
  }): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    mockUsers.push(newUser);
    return newUser;
  },
}; 