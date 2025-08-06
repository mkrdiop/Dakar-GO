import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const mockLogin = vi.fn();
const mockToast = vi.fn();

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />);
    expect(screen.getByRole('heading', { name: /Se connecter/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresse e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.click(submitButton);

    expect(await screen.findByText(/Adresse e-mail invalide./i)).toBeInTheDocument();
    expect(await screen.findByText(/Le mot de passe doit contenir au moins 6 caractères./i)).toBeInTheDocument();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows the user to log in with correct credentials', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.type(emailInput, 'marchand@dakar.go');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { id: 'mock-user-1', email: 'marchand@dakar.go', firstName: 'Mock', lastName: 'Marchand' },
        'fake-auth-token-mock-user'
      );
    }, { timeout: 2000 });

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            title: 'Connexion réussie!',
            description: 'Bienvenue, marchand@dakar.go!',
        });
    }, { timeout: 2000 });
  });

  it('shows an error message with incorrect credentials', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.type(emailInput, 'wrong@email.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Échec de la connexion',
        description: 'Identifiants incorrects. Veuillez réessayer.',
        variant: 'destructive',
      });
    }, { timeout: 2000 });
  });

  it('toggles password visibility', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
