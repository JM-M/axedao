'use client';

import { Button } from '@nextui-org/button';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  back?: string | boolean;
}
const PageHeading = ({ children, className = '', back, ...props }: Props) => {
  const router = useRouter();

  return (
    <div className="relative z-[1] mb-10 flex items-center gap-3">
      {back && (
        <Button
          variant="light"
          onPress={() => {
            if (back && typeof back === 'string') {
              router.push(back);
            } else if (back && window?.history && window.history.length > 1) {
              router.back();
            }
          }}
          className="!min-w-[unset] !px-0"
          isIconOnly
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <h1 className={clsx('text-2xl font-bold', className)} {...props}>
        {children}
      </h1>
    </div>
  );
};
export default PageHeading;
