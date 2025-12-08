import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useUpdateUserProfile } from '@/shared/api/generated/users/users';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { NAVIGATION_MAP } from '@/shared/config/navigation';

const welcomeSchema = z.object({
  name: z.string().min(1, MESSAGES_HELPER.VALIDATION.REQUIRED_FIELD),
});

type WelcomeFormSchema = z.infer<typeof welcomeSchema>;

export function WelcomePage(): JSX.Element {
  const navigate = useNavigate();
  const { updateUserName } = useAuthStore();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WelcomeFormSchema>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      name: useAuthStore.getState().user?.name || '',
    },
  });

  async function handleSaveName(formData: WelcomeFormSchema): Promise<void> {
    try {
      await updateUserProfile({
        data: {
          name: formData.name,
        },
      });

      updateUserName(formData.name);

      toast.success(MESSAGES_HELPER.WELCOME_SCREEN.SUCCESS_MESSAGE);
      navigate(NAVIGATION_MAP.DASHBOARD.path);
    } catch {
      toast.error(MESSAGES_HELPER.GLOBAL.UNKNOWN_ERROR);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5] p-4">
      <Card className="w-full max-w-md border-none bg-transparent shadow-none">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-2xl font-normal text-foreground">
            {MESSAGES_HELPER.WELCOME_SCREEN.TITLE}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSaveName)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Input
                id="name"
                type="text"
                placeholder={MESSAGES_HELPER.WELCOME_SCREEN.INPUT_PLACEHOLDER}
                className="h-12 bg-white"
                {...register('name')}
              />
              {errors.name && (
                <span className="text-sm text-destructive">{errors.name.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-lg font-bold text-white hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : MESSAGES_HELPER.WELCOME_SCREEN.BUTTON}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
