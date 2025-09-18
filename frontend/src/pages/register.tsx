import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppDispatch, RootState } from '../stores';
import { registerStart, clearJustRegistered } from '../stores/slices/authSlice';
import { useEffect } from 'react';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, error, justRegistered } = useSelector((state: RootState) => state.auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(registerStart(values));
  }
  
  useEffect(() => {
    if (justRegistered) {
      navigate('/login');
      // clear the flag so subsequent visits don't redirect
      setTimeout(() => dispatch(clearJustRegistered()), 0);
    }
  }, [justRegistered, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">Create an account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <p className="text-sm font-medium text-destructive" role="alert">
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full h-10" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account…' : 'Create Account'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <span
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </span>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}