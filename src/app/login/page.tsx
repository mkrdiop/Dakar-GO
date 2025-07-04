import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, signup } from '@/app/auth/actions';
import { Package, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage({
    searchParams,
  }: {
    searchParams: { message: string };
  }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
            <div className="inline-block mx-auto bg-primary/20 p-3 rounded-full mb-4">
                <Package className="w-8 h-8 text-primary" />
            </div>
          <CardTitle className="text-2xl">fructiFruit Admin</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
            {searchParams.message && (
                <Alert className="mb-4 bg-background">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        {searchParams.message}
                    </AlertDescription>
                </Alert>
            )}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex gap-2 pt-2">
                <Button formAction={login} type="submit" className="w-full">
                Login
                </Button>
                <Button formAction={signup} type="submit" variant="outline" className="w-full">
                Sign Up
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
