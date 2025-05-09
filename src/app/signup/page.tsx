
import SignupForm from '@/components/auth/SignupForm';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 py-12">
      <div className="absolute inset-0 opacity-5">
        {/* Optional subtle background pattern */}
      </div>
      <div className="mb-8 text-center z-10">
         <Image src="https://picsum.photos/100/100" alt="Dakar Go Logo" width={100} height={100} className="mx-auto rounded-full shadow-lg" data-ai-hint="logo delivery app" />
        <h1 className="text-4xl font-bold text-primary mt-4">Dakar Go</h1>
        <p className="text-muted-foreground">Inscrivez-vous pour gérer vos livraisons.</p>
      </div>
      <SignupForm />
    </div>
  );
}
