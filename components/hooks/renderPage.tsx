import { useRouter } from 'next/router';

const renderPage = () => {
    const router = useRouter();

    const refresh = () => {
        router.reload();
    };

    return { refresh };
};

export default renderPage;