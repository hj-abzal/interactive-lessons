import {MutableRefObject, useState} from 'react';
import {useDrop} from '@/components/membrane/context';
import styled from '@emotion/styled';
import {useSetUnsetRef} from '@/components/membrane/useSetUnsetRef';
import {useEnhancedRef} from '@/components/membrane/useEnhancedRef';

const Component = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    height: 50%;
    width: 100%;
    background:  linear-gradient(180deg, #ACE3D9 0%, #ACD3E3 100%), #ACE3D9;

    user-select: none;
`;
const Title = styled.div`
    position: absolute;
    left: 716px;
    right: 20px;
    top: 121px;
    bottom: 115px;

    font-family: Ubuntu;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    line-height: 62px;
/* or 103% */

    text-align: right;
    letter-spacing: 1px;

    color: #89CDC1;
`;
interface InnerProps {
    setRef: (id: string, ref: HTMLElement) => void;
    unsetRef: (id: string) => void;
    id: string;
}

export function Inner(props: InnerProps) {
    const {setRef, unsetRef, id} = props;
    const [meta, setMeta] = useState({type: 'inner', id});
    const {ref, attributes} = useDrop(id, meta);

    const outerRef = useEnhancedRef(ref, {setMeta});
    useSetUnsetRef(outerRef, setRef, unsetRef, id);

    return <Component ref={ref as MutableRefObject<HTMLDivElement>} {...attributes}>
        <Title>
            Внутриклеточная среда
        </Title>
    </Component>;
}
