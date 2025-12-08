import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useLogin } from '@/shared/api/generated/auth/auth';
import { LoginDto } from '@/shared/api/generated/model';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

const loginSchema = z.object({
  email: z.string().email(MESSAGES_HELPER.VALIDATION.INVALID_EMAIL),
  password: z.string().min(6, MESSAGES_HELPER.VALIDATION.MIN_PASSWORD),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

interface BackendErrorResponse {
  statusCode: number;
  message: string;
  errors?: {
    field: string;
    errors: string[];
  }[];
}

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const { mutateAsync: loginUser } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(formData: LoginFormSchema): Promise<void> {
    try {
      const payload: LoginDto = {
        email: formData.email,
        password: formData.password,
      };

      const result = await loginUser({ data: payload });

      if (result.accessToken) {
        localStorage.setItem('access_token', result.accessToken);
        navigate('/');
      }
    } catch (error) {
      const axiosError = error as AxiosError<BackendErrorResponse>;

      if (axiosError.response?.data?.errors) {
        const backendErrors = axiosError.response.data.errors;

        if (Array.isArray(backendErrors)) {
          backendErrors.forEach((err) => {
            if (err.field) {
              setError(err.field as keyof LoginFormSchema, {
                type: 'manual',
                message: err.errors[0],
              });
            }
          });
        }
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{MESSAGES_HELPER.AUTH.LOGIN_TITLE}</CardTitle>
        <CardDescription>{MESSAGES_HELPER.AUTH.LOGIN_SUBTITLE}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder={MESSAGES_HELPER.AUTH.EMAIL_PLACEHOLDER}
              {...register('email')}
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder={MESSAGES_HELPER.AUTH.PASSWORD_PLACEHOLDER}
              {...register('password')}
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? MESSAGES_HELPER.AUTH.BUTTON_LOGGING_IN
              : MESSAGES_HELPER.AUTH.BUTTON_LOGIN}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
