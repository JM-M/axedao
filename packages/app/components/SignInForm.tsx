'use client';

import { signInFormSchema, SignInFormType } from '@/constants/schemas';
import useSignIn from '@/hooks/useSignIn';
import { cn } from '@/utils/tailwind';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

type Props = { className?: string };
const SignInForm = ({ className }: Props) => {
  const { address, isConnected } = useAccount();
  const session = useSession();
  const { connect } = useConnect();

  const { control, handleSubmit, setValue, watch, trigger } = useForm<SignInFormType>({
    resolver: yupResolver(signInFormSchema),
    defaultValues: {
      walletAddress: address,
    },
  });

  const { signInMutation } = useSignIn();

  useEffect(() => {
    setValue('walletAddress', address || '');
    if (address) {
      signInMutation.reset();
      trigger();
    }
  }, [address, isConnected, setValue, trigger, signInMutation.reset]);


  const isLoading = session.status === 'loading';
  const isSigningIn = signInMutation.isPending;
  const submitError = signInMutation.error;

  return (
    <form
      className="m-auto flex h-fit w-full max-w-sm flex-col gap-3"
      onSubmit={handleSubmit(() => signInMutation.mutate())}
    >
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
      {submitError && <div className="my-2 text-center text-small text-danger">{submitError.message}</div>}
      <Button
        key="sign-in-button"
        type="submit"
        color="primary"
        className={cn('mt-5 w-full', className)}
        isLoading={isSigningIn}
        disabled={isLoading || isSigningIn}
      >
        Sign in
      </Button>
    </form>
  );
};
export default SignInForm;
