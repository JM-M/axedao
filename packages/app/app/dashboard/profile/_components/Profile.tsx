'use client';

import ContactInfo from '@/components/ContactInfo';
import { Button } from '@nextui-org/button';
import { Avatar } from '@nextui-org/react';
import { Camera, Edit } from 'lucide-react';
import Link from 'next/link';
import { useIsInitializingProfile, useProfile } from '../store';
import { ProfileSkeleton } from './skeletons';

const Profile = () => {
  const profile = useProfile();
  const isLoading = useIsInitializingProfile();
  const { name, title, avatar, links } = profile;

  if (isLoading || !profile.id) return <ProfileSkeleton />;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <Avatar
        showFallback
        src={avatar || undefined}
        fallback={<Camera className="h-10 w-10 animate-pulse text-default-500" strokeWidth={1} size={20} />}
        className="aspect-square h-full max-h-32 w-full max-w-32"
      />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col items-center justify-center gap-5 md:gap-10 xs:flex-row">
          <div className="text-center xs:text-left">
            <h3 className="text-lg font-medium">{name}</h3>
            <div className="text-small capitalize text-default-500 flex justify-center xs:justify-start gap-2 mt-2">
              {title}
            </div>
          </div>
          <div className="xs:mb-auto xs:ml-auto">
            <Button
              as={Link}
              href="/dashboard/profile/edit"
              startContent={<Edit className="h-4 w-4" />}
              size="sm"
              variant="bordered"
            >
              Edit profile
            </Button>
          </div>
        </div>
        <ContactInfo links={links} />
      </div>
    </div>
  );
};
export default Profile;
