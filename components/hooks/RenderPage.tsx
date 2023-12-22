import { useRouter } from 'next/router';

const RenderPage = () => {
    const router = useRouter();

    const refresh = () => {
        router.reload();
    };

    return { refresh };
};

export default RenderPage;