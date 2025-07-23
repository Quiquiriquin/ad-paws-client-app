import { FormProvider, useForm } from 'react-hook-form';

export default function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    mode: 'onChange',
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}
