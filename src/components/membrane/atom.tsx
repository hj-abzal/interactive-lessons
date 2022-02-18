import {useState, useMemo, MutableRefObject, useEffect} from 'react';
import {AtomInfo, AtomType, EnvType, Images} from '@/components/membrane/types';
import {atomSize} from '@/components/membrane/utils';
import {useDrag} from '@/components/membrane/context';
import styled from '@emotion/styled';
import {keyframes, css} from '@emotion/react';
import {random} from 'lodash';
import {useSetUnsetRef} from '@/components/membrane/useSetUnsetRef';
import {useEnhancedRef} from '@/components/membrane/useEnhancedRef';

const atoms: Record<AtomType, AtomType> = {
    oxygen: 'oxygen',
    water: 'water',
    sodium: 'sodium',
    potassium: 'potassium',
    glucose: 'glucose',
    bacterium: 'bacterium',
    undigested: 'undigested',
    na: 'na',
    k: 'k',
};

export const AtomsArr = Object.keys(atoms);

const float = keyframes`
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10%);
    }
    100% {
        transform: translateY(0);
    }
`;

const AtomWrap = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

const AtomEl = styled.img<{animate: boolean, animationDelay: number}>`
    animation: ${({animate, animationDelay}) => animate
        ? css`${float} 6s ease-in-out ${animationDelay}s infinite` : 'none'};
`;

interface AtomProps extends AtomInfo {
    setRef: (id: string, ref: HTMLElement) => void;
    unsetRef: (id: string) => void;
    images: Images;
}

interface AtomInnerProps {
    atom: AtomType;
    animate: boolean;
    animationDelay: number;
    envType: EnvType;
    images: Images;
}

function DefaultAtom({atom, animate, animationDelay, images}: AtomInnerProps) {
    return <AtomEl
        height={atomSize[atom].y}
        width={atomSize[atom].x}
        animate={animate}
        animationDelay={animationDelay}
        draggable='false'
        src={images[atom]}
    />;
}

const BacteriumWrap = styled.div<{
    height: number;
    width: number;
    animate: boolean;
    animationDelay: number;
}>`
    position: relative;
    height: ${({height}) => height}px;
    width: ${({width}) => width}px;
    animation: ${({animate, animationDelay}) => animate
        ? css`${float} 6s ease-in-out ${animationDelay}s infinite` : 'none'};
`;

const AbsoluteAtom = styled(AtomEl)`
    position: absolute;
    top: 0;
    left: 0;
`;

function Bacterium({atom, animate, animationDelay, envType, images}: AtomInnerProps) {
    return <BacteriumWrap
        height={atomSize[atom].y}
        width={atomSize[atom].x}
        animate={animate}
        animationDelay={animationDelay}
    >
        {envType === 'inner' && <AbsoluteAtom
            animate={false}
            animationDelay={animationDelay}
            draggable='false'
            src={images.bubble}
        />}
        <AbsoluteAtom
            animate={false}
            animationDelay={animationDelay}
            draggable='false'
            src={images[atom]}
        />
    </BacteriumWrap>;
}

function AtomInner(props: AtomInnerProps) {
    const {atom} = props;

    switch (atom) {
        case 'bacterium':
        case 'undigested':
            return <Bacterium {...props} />;
        default:
            return <DefaultAtom {...props} />;
    }
}

export function Atom({id, setRef, unsetRef, coords, meta, images}: AtomProps) {
    const {type} = meta;
    const {ref, listeners, attributes, transform} = useDrag(id, meta);
    const [innerCoords, setInnerCoords] = useState(coords);
    const [animationDelay] = useState(() => random(0, 5));

    const outerRef = useEnhancedRef(ref, {setCoords: setInnerCoords});
    useSetUnsetRef(outerRef, setRef, unsetRef, id);

    const style = useMemo(() => ({
        transform: `translate(${
            innerCoords.x + (transform?.x || 0)
        }px, ${innerCoords.y + (transform?.y || 0)
        }px) translate(-50%, -50%)`, zIndex: transform ? 1 : 0,
        cursor: transform ? 'grabbing' : 'grab',
    }), [innerCoords, transform]);

    useEffect(() => {
        setInnerCoords(coords);
    }, [coords]);

    return <AtomWrap ref={ref as MutableRefObject<HTMLDivElement>}
        style={style}
        {...listeners}
        {...attributes}>
        <AtomInner
            images={images}
            envType={meta.envType as EnvType}
            atom={type as AtomType}
            animate={!transform}
            animationDelay={animationDelay}
        />
    </AtomWrap>;
}
