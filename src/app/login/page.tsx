'use client';
import { LoaderIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { APP_NAME } from '@/config/app';
import { AUTH_AA_PROVIDER_ID } from '@/config/auth';

export default function Login() {
	useEffect(() => {
		signIn(AUTH_AA_PROVIDER_ID, {
			callbackUrl: "/",
			redirect: true,
		});
	}, []);

	return (

		<div className="flex items-center justify-center h-screen bg-gray-800 ">
			<div className="flex items-center justify-center text-neutral-100">
				<LoaderIcon className="animate-spin h-6 w-6 mr-3" />
				<span className="text-2xl font-semibold">Loading {APP_NAME}</span>
			</div>
		</div>
	);
}