'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

import { ArrowLeft } from 'lucide-react';

const RegisterCard = () => {
  const [formdata, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your data below to create a new account
        </CardDescription>
        <CardAction>
          <ArrowLeft
            onClick={() => (window.location.href = '/')}
            className="cursor-pointer border p-1 hover:bg-gray-200 transition-colors rounded-full"
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formdata.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={formdata.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          onClick={async () => {
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formdata),
            });
            const result = await response.json();
            console.log(result);

            if (result.success) {
              window.location.href = '/';
            } else {
              alert(result.error || 'Registration failed');
            }
          }}
        >
          Register
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
