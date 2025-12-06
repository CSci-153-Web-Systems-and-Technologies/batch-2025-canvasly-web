import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-3">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
