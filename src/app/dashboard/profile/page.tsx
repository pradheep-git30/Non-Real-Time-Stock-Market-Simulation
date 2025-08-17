
"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatar } from '@/ai/flows/avatar-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Sparkles, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePageSkeleton = () => (
    <div className="container mx-auto animate-fade-in-up">
        <Skeleton className="h-9 w-40 mb-8" />
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-5 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-8 w-40" />
                </div>
            </CardContent>
            <CardFooter className='flex-col gap-6 items-stretch'>
                <div>
                    <Skeleton className="h-5 w-full mb-2" />
                    <div className='flex flex-col gap-2'>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    </div>
);


export default function ProfilePage() {
    const { userData, updateAvatar } = useApp();
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGenerateAvatar = async () => {
        if (!prompt) {
            toast({
                variant: 'destructive',
                title: 'Prompt is empty',
                description: 'Please enter a description for your avatar.',
            });
            return;
        }
        setLoading(true);
        try {
            const response = await generateAvatar({ prompt });
            if (response.avatarDataUri) {
                setGeneratedAvatar(response.avatarDataUri);
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Generation Failed',
                    description: 'Could not generate a new avatar. Please try again.',
                });
            }
        } catch (error) {
            console.error('Avatar generation error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while generating your avatar.',
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleSetAvatar = () => {
        if (generatedAvatar) {
            updateAvatar(generatedAvatar);
            toast({
                title: 'Avatar Updated!',
                description: 'Your new AI-generated avatar has been set.',
            });
            setGeneratedAvatar(null);
        }
    }

    if (!userData) {
        return <ProfilePageSkeleton />;
    }

    return (
        <div className="container mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your profile information and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-32 w-32 border-4 border-primary transition-transform duration-300 hover:scale-110">
                            <AvatarImage src={userData.user.avatar} alt={userData.user.name} />
                            <AvatarFallback className="text-5xl">
                               <User />
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold">{userData.user.name}</h2>
                    </div>
                </CardContent>
                
                <CardFooter className='flex-col gap-6 items-stretch'>
                     <div>
                        <p className="text-sm text-muted-foreground text-center mb-2">Want a new look? Let AI generate a funny cartoon avatar for you!</p>
                        <div className='flex flex-col gap-2'>
                           <Textarea 
                              placeholder="e.g., A cool robot trading stocks on a futuristic computer" 
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                            />
                           <Button onClick={handleGenerateAvatar} disabled={loading} className="animate-pulse-slow">
                               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                               {loading ? 'Generating...' : 'Generate with AI'}
                           </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={!!generatedAvatar} onOpenChange={(open) => !open && setGeneratedAvatar(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Your New Avatar</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center my-4 relative">
                        {loading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                        {generatedAvatar && <Image src={generatedAvatar} alt="Generated Avatar" width={256} height={256} className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" data-ai-hint="avatar cartoon"/>}
                    </div>
                    <DialogFooter className='sm:justify-center gap-2'>
                        <Button onClick={handleGenerateAvatar} variant="secondary" disabled={loading}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Generate Again
                        </Button>
                        <Button onClick={handleSetAvatar} disabled={loading}>
                            Set as Avatar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
