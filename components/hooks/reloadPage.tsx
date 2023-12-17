import { useRouter } from 'next/router';

const page = () => {
    const router = useRouter();

    const refresh = () => {
        router.reload();
    };

    return { refresh };
};

export default page;