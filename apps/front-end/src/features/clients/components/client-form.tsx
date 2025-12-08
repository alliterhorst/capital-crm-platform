import { JSX, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

function formatBrlFromCents(cents: number): string {
  const value = cents / 100;
  return new Intl.NumberFormat(MESSAGES_HELPER.CLIENTS.CURRENCY.LOCALE, {
    style: 'currency',
    currency: MESSAGES_HELPER.CLIENTS.CURRENCY.CURRENCY,
  }).format(value);
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function parseBrlToNumber(value: string): number {
  const digits = onlyDigits(value);
  if (!digits) return 0;
  return Number(digits) / 100;
}

function formatInputCurrency(value: string): string {
  const digits = onlyDigits(value);
  if (!digits) return '';
  return formatBrlFromCents(Number(digits));
}

const clientSchema = z.object({
  name: z.string().min(1, MESSAGES_HELPER.VALIDATION.REQUIRED_NAME),
  salary: z.string().min(1, MESSAGES_HELPER.VALIDATION.REQUIRED_SALARY),
  companyValue: z.string().min(1, MESSAGES_HELPER.VALIDATION.REQUIRED_COMPANY_VALUE),
});

type ClientFormSchema = z.infer<typeof clientSchema>;

export type ClientFormPayload = {
  name: string;
  salary: number;
  companyValue: number;
};

export type ClientFormInitialValues = {
  name: string;
  salary: number;
  companyValue: number;
};

interface ClientFormProps {
  initialValues?: ClientFormInitialValues;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onSubmit: (payload: ClientFormPayload) => Promise<void>;
}

export function ClientForm({
  initialValues,
  submitLabel,
  pendingLabel,
  isPending,
  onSubmit,
}: ClientFormProps): JSX.Element {
  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', salary: '', companyValue: '' },
  });

  useEffect(() => {
    if (!initialValues) {
      form.reset({ name: '', salary: '', companyValue: '' });
      return;
    }

    form.reset({
      name: initialValues.name,
      salary: formatBrlFromCents(Math.round(Number(initialValues.salary) * 100)),
      companyValue: formatBrlFromCents(Math.round(Number(initialValues.companyValue) * 100)),
    });
  }, [initialValues, form]);

  const salaryValue = form.watch('salary');
  const companyValueValue = form.watch('companyValue');

  const handleSubmit = form.handleSubmit(async (raw: ClientFormSchema): Promise<void> => {
    const parsed = clientSchema.parse(raw);

    await onSubmit({
      name: parsed.name,
      salary: parseBrlToNumber(parsed.salary),
      companyValue: parseBrlToNumber(parsed.companyValue),
    });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Input
          id="name"
          placeholder={MESSAGES_HELPER.CLIENTS.FIELDS.NAME_PLACEHOLDER}
          className="h-12"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="salary"
          inputMode="numeric"
          placeholder={MESSAGES_HELPER.CLIENTS.FIELDS.SALARY_PLACEHOLDER}
          className="h-12"
          value={salaryValue}
          onChange={(e) => form.setValue('salary', formatInputCurrency(e.target.value))}
        />
        {form.formState.errors.salary && (
          <p className="text-sm text-destructive">{form.formState.errors.salary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="companyValue"
          inputMode="numeric"
          placeholder={MESSAGES_HELPER.CLIENTS.FIELDS.COMPANY_PLACEHOLDER}
          className="h-12"
          value={companyValueValue}
          onChange={(e) => form.setValue('companyValue', formatInputCurrency(e.target.value))}
        />
        {form.formState.errors.companyValue && (
          <p className="text-sm text-destructive">{form.formState.errors.companyValue.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="h-12 w-full text-lg font-bold">
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
