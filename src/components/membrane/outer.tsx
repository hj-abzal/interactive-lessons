import {MutableRefObject, useState} from 'react';
import {useDrop} from '@/components/membrane/context';
import styled from '@emotion/styled';
import {useSetUnsetRef} from '@/components/membrane/useSetUnsetRef';
import {useEnhancedRef} from '@/components/membrane/useEnhancedRef';

const Component = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 50%;
    width: 100%;
    background:  linear-gradient(180deg, #F6EABF 0%, #F6E3BF 25.01%), #F5D9BE;
    
    user-select: none;
`;
const Title = styled.div`
    position: absolute;
    left: 40px;
    right: 803px;
    top: 98px;
    bottom: 138px;

    font-family: Ubuntu;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    line-height: 62px;
/* or 103% */
    letter-spacing: 1px;

    color: #EABB8D;
`;
interface OuterProps {
    setRef: (id: string, ref: HTMLElement) => void;
    unsetRef: (id: string) => void;
    id: string;
}

export function Outer(props: OuterProps) {
    const {setRef, unsetRef, id} = props;
    const [meta, setMeta] = useState({type: 'outer', id});
    const {ref, attributes} = useDrop(id, meta);

    const outerRef = useEnhancedRef(ref, {setMeta});
    useSetUnsetRef(outerRef, setRef, unsetRef, id);

    return <Component ref={ref as MutableRefObject<HTMLDivElement>} {...attributes}>
        <Title>
            Внеклеточная среда
        </Title>
    </Component>;
}
