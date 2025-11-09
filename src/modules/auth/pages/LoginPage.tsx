import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { useToast } from '../../../hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
        variant: "default",
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('license')) {
        setError('root', {
          type: 'manual',
          message: 'Your license is invalid or expired. Please contact support.',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Failed to login. Please check your credentials.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-14 px-4 relative z-10">
      <div className="card-bg-neo w-full max-w-md p-8 md:p-10 shadow-2xl border border-[#24263d] space-y-7">
        <h2 className="text-3xl font-bold text-white text-center pb-2 tracking-tight">Sign in</h2>
        {errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.root.message}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#a0a0b2] block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[#a0a0b2] block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-between items-center pt-0">
            <Button variant="link" type="button" className="text-xs">Forgot password?</Button>
          </div>
          <div className="flex justify-end items-center space-x-3 pt-1">
            <Button variant="link" type="button" className="text-sm">Create an account</Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
