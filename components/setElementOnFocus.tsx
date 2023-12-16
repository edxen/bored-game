import { useEffect } from "react";

type TSetElementOnFocus = {
    condition: boolean;
    elementRef: React.RefObject<HTMLButtonElement>;
};

const setElementOnFocus = ({ condition, elementRef }: TSetElementOnFocus) => {
    useEffect(() => {
        if (condition && elementRef.current) elementRef.current.focus();
    }, [condition, elementRef]);
};

export default setElementOnFocus;