import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useUserStore } from '../../store/useUserStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login({ name: email.split('@')[0], email, avatarUrl: '' });
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
       <Card className="w-full max-w-md relative z-10">
         <CardHeader className="text-center pb-2">
           <div className="mx-auto bg-primary/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
             <span className="text-2xl font-bold bg-clip-text text-transparent bg-primary-gradient">X</span>
           </div>
           <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
           <CardDescription>Sign in to your InterviewX account</CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleLogin} className="space-y-4 pt-4">
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">Email Address</label>
               <Input 
                 type="email" 
                 placeholder="you@example.com" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">Password</label>
               <Input 
                 type="password" 
                 placeholder="••••••••" 
                 required
               />
             </div>
             <Button type="submit" className="w-full mt-6">
               Sign In
             </Button>
           </form>
         </CardContent>
         <CardFooter className="text-center flex justify-center text-sm text-gray-400 border-t border-glass pt-4 mt-2">
           Don't have an account? <span className="text-primary hover:underline ml-1 cursor-pointer">Sign up</span>
         </CardFooter>
       </Card>
    </div>
  );
}
