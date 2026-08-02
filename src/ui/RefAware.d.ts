import { type PropsWithChildren } from 'react';
interface RefAwareProps {
    value: unknown;
    onChange: (value: unknown) => void;
    emptyValue?: unknown;
    className?: string;
}
export declare function RefAware({
    value,
    onChange,
    emptyValue,
    className,
    children,
}: PropsWithChildren<RefAwareProps>): import('react/jsx-runtime').JSX.Element;
export {};
