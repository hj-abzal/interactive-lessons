import React, {useEffect, useRef, useState} from 'react';
import P5 from 'p5';
import cl from 'classnames';

export type Props = {
    name: string,
    className?: string,
    sketch: {
        setup: (p: P5) => void,
        draw: (p: P5, ...any) => void,
    }
}

export const CanvasSketch = ({
    name,
    sketch,
    className,
}: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [p5Instance, setP5Instance] = useState<P5 | null>(null);

    useEffect(() => {
        if (!sketch || !containerRef.current || p5Instance) {
            return;
        }

        const p = new P5((s: P5) => {
            s.setup = () => {
                sketch.setup(s);
            };

            s.draw = (...rest) => {
                sketch.draw(s, ...rest);
            };
        }, containerRef.current);

        setP5Instance(p);
    }, [containerRef.current, sketch]);

    return (
        <div className={cl(name, className)} ref={containerRef} />
    );
};
