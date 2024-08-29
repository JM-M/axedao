'use client';

import { RegistrationFormType, registrationFormSchema } from '@/constants/schemas';
import useRegister from '@/hooks/useRegister';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const RegistrationForm = () => {
  const { address, isConnected } = useAccount();
  const session = useSession();
  const { connect } = useConnect();

  const { control, handleSubmit, setValue, watch } = useForm<RegistrationFormType>({
    resolver: yupResolver(registrationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      walletAddress: address,
    },
  });

  const { registrationMutation } = useRegister();
  const resetSubmitMutation = registrationMutation.reset;

  useEffect(() => {
    setValue('walletAddress', address || '');
    resetSubmitMutation();
  }, [address, isConnected, setValue, resetSubmitMutation]);

  const isSubmitting = registrationMutation.isPending;
  const isLoading = session.status === 'loading';
  const submitError: AxiosError | Error | null = registrationMutation.error;

  return (
    <form
      className="m-auto flex h-fit w-full max-w-sm flex-col gap-3"
      onSubmit={handleSubmit(registrationMutation.mutate as SubmitHandler<RegistrationFormType>)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => {
          return (
            <Input
              {...field}
              label="Full name"
              className="w-full"
              classNames={{ inputWrapper: '!min-h-14', errorMessage: 'text-left' }}
              color={error ? 'danger' : undefined}
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => {
          return (
            <Input
              {...field}
              type="email"
              label="Email"
              className="w-full"
              classNames={{ inputWrapper: '!min-h-14', errorMessage: 'text-left' }}
              color={error ? 'danger' : undefined}
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <div className="flex flex-col items-end">
        <Controller
          control={control}
          name="walletAddress"
          render={({ field, fieldState: { error } }) => {
            const { value } = field;
            return (
              <Input
                {...field}
                value={value || ''}
                label="Wallet address (MetaMask)"
                className="w-full"
                classNames={{
                  inputWrapper: '!min-h-14 data-[hover=true]:bg-initial',
                  input: 'text-sm !text-default-500',
                  errorMessage: 'text-left',
                }}
                color={error ? 'danger' : undefined}
                isInvalid={!!error}
                errorMessage={error?.message}
                placeholder={!value ? 'No wallet connected' : undefined}
                readOnly
              />
            );
          }}
        />
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto w-fit mt-2"
          onPress={() => connect({ connector: injected() })}
        >
          {watch('walletAddress') ? 'Change' : 'Connect'}
        </Button>
      </div>
      {submitError && (
        <div className="my-2 text-center text-small text-danger">
          {(submitError as AxiosError<{ error: string }>).response?.data?.error || submitError.message}
        </div>
      )}
      <Button
        key="register-button"
        type="submit"
        color="primary"
        className="mt-5 w-full"
        isLoading={isSubmitting}
        disabled={isLoading || isSubmitting}
      >
        Register
      </Button>
    </form>
  );
};

export default RegistrationForm;
