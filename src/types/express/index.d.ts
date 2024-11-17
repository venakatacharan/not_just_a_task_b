import 'express';

// Extend the Passport's User interface
declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      photo: string;
    }

    interface Request {
      user ?: User;
    }
  }
}