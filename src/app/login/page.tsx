
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
       <div className="absolute inset-0 opacity-5">
        {/* You can add a subtle background pattern or image here if desired */}
      </div>
      <div className="mb-8 text-center z-10">
        <Image src="https://picsum.photos/100/100" alt="Dakar Go Logo" width={100} height={100} className="mx-auto rounded-full shadow-lg" data-ai-hint="logo delivery" />
        <h1 className="text-4xl font-bold text-primary mt-4">Dakar Go</h1>
        <p className="text-muted-foreground">Votre partenaire de livraison fiable.</p>
      </div>
      <LoginForm />
    </div>
  );
}
