import {useDrop} from '@/components/membrane/context';
import {CanalType, Images} from '@/components/membrane/types';
import {MutableRefObject, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import {useSetUnsetRef} from '@/components/membrane/useSetUnsetRef';
import {useEnhancedRef} from '@/components/membrane/useEnhancedRef';
import {css} from '@emotion/react';

const baseCss = `
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    padding-top: 10%;
`;

const BaseImg = styled.div<{highlight: boolean; source: string | undefined}>`
    ${baseCss};
    transition: filter 0.1s ease;

    filter: ${({highlight}) => highlight ? 'drop-shadow(0px 0px 27px #FFFF00)' : 'none'};

    :after {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        background-position: center;
        background-size: cover;
        background-image: url(${({source}) => source});
    }

`;

const Highlight = styled.div<{show: boolean, source: string | undefined}>`
    ${baseCss};
    transition: opactiy 1s ease-in;
    opacity: ${({show}) => show ? 1 : 0};

    :after {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        background-position: center;
        background-size: cover;
        background-image: url(${({source}) => source});
    }
`;

interface MembraneProps {
    setRef: (id: string, ref: HTMLElement) => void;
    unsetRef: (id: string) => void;
    id: string;
    highlight: {
        full: boolean;
        usiki: boolean;
        shariki: boolean;
    };
    canals: CanalType[];
    canalsState: {
        [type: string]: {
            isOpen?: boolean,
        }
    }
    images: Images;
}

const Canals = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-around;
    user-select: none;
    > * {
        transform: scale(0.33);
        user-select: none;
    }
`;

interface CanalProps {
    canal: CanalType;
    canalState?: {
        isOpen?: boolean,
    }
    index: number;
    setRef: (id: string, ref: HTMLElement) => void;
    unsetRef: (id: string) => void;
    images: Images;
}

function SimpleCanal(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;
    const [meta, setMeta] = useState({type: canal, id: `${canal}-${index}`});
    const {ref, attributes} = useDrop(meta.id, meta);

    const outerRef = useEnhancedRef(ref, {setMeta});
    useSetUnsetRef(outerRef, setRef, unsetRef, meta.id);

    return <img {...attributes} src={images[canal]} ref={ref as MutableRefObject<HTMLImageElement>} />;
}

const CanalWithSpaceWrap = styled.div<{margin?: string, flip?: boolean, left?: number}>`
    position: relative;
  
    ${({flip}) => flip && css`
      transform: rotate(180deg) scale(0.33);
    `}


    ${({left}) => left && css`
      margin-right: ${-left}px;
    `}
    
    & > img {
        margin-bottom: ${({margin}) => margin || 'unset'};
    }
`;

const TopSpace = styled.div`
    width: 150%;
    height: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
`;

const BottomSpace = styled.div`
    width: 150%;
    height: 50%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
`;

const MainImage = styled.img<{visible: boolean}>`
    opacity: ${({visible}) => visible ? 1 : 0};
`;

const SecondaryImage = styled.img<{visible: boolean}>`
    opacity: ${({visible}) => visible ? 1 : 0};
    position: absolute;
    top: 0;
    left: 0;
`;

function ProteinCanal(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;
    const [canalMeta, setCanalMeta] = useState({type: canal, id: `${canal}-${index}`, open: false});
    const [topMeta, setTopMeta] = useState({
        type: `${canal}-top`,
        id: `${canalMeta.id}-top-${index}`,
        parentId: canalMeta.id,
    });
    const [bottomMeta, setBottomMeta] = useState({
        type: `${canal}-bottom`,
        id: `${canalMeta.id}-bottom-${index}`,
        parentId: canalMeta.id,
    });

    const {ref: canalRef, attributes: canalAttributes} = useDrop(canalMeta.id, canalMeta);
    const {ref: topRef, attributes: topAttributes} = useDrop(topMeta.id, topMeta);
    const {ref: bottomRef, attributes: bottomAttributes} = useDrop(bottomMeta.id, bottomMeta);

    const outerCanalRef = useEnhancedRef(canalRef, {setMeta: setCanalMeta});
    const outerTopRef = useEnhancedRef(topRef, {setMeta: setTopMeta});
    const outerBottomRef = useEnhancedRef(bottomRef, {setMeta: setBottomMeta});

    useSetUnsetRef(outerCanalRef, setRef, unsetRef, canalMeta.id);
    useSetUnsetRef(outerTopRef, setRef, unsetRef, topMeta.id);
    useSetUnsetRef(outerBottomRef, setRef, unsetRef, bottomMeta.id);

    return <CanalWithSpaceWrap
        {...canalAttributes}
        ref={canalRef as MutableRefObject<HTMLDivElement>}
        margin={'-50%'}
    >
        <TopSpace ref={topRef as MutableRefObject<HTMLDivElement>} {...topAttributes} />
        <BottomSpace ref={bottomRef as MutableRefObject<HTMLDivElement>} {...bottomAttributes} />
        <MainImage visible={canalMeta.open} src={images['protein-canal-open']} />
        <SecondaryImage
            src={images['protein-canal-close']} visible={!canalMeta.open} />
    </CanalWithSpaceWrap>;
}

function SinapsNaCanal(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;

    const [canalMeta, setCanalMeta] = useState({type: canal, id: `${canal}-${index}`, open: false});

    const [topMeta, setTopMeta] = useState({
        type: `${canal}-top`,
        id: `${canalMeta.id}-top-${index}`,
        parentId: canalMeta.id,
    });

    const [bottomMeta, setBottomMeta] = useState({
        type: `${canal}-bottom`,
        id: `${canalMeta.id}-bottom-${index}`,
        parentId: canalMeta.id,
    });

    const {ref: canalRef, attributes: canalAttributes} = useDrop(canalMeta.id, canalMeta);
    const {ref: topRef, attributes: topAttributes} = useDrop(topMeta.id, topMeta);
    const {ref: bottomRef, attributes: bottomAttributes} = useDrop(bottomMeta.id, bottomMeta);

    const outerCanalRef = useEnhancedRef(canalRef, {setMeta: setCanalMeta});
    const outerTopRef = useEnhancedRef(topRef, {setMeta: setTopMeta});
    const outerBottomRef = useEnhancedRef(bottomRef, {setMeta: setBottomMeta});

    useSetUnsetRef(outerCanalRef, setRef, unsetRef, canalMeta.id);
    useSetUnsetRef(outerTopRef, setRef, unsetRef, topMeta.id);
    useSetUnsetRef(outerBottomRef, setRef, unsetRef, bottomMeta.id);

    useEffect(() => {
        if (Boolean(props.canalState?.isOpen) !== canalMeta.open) {
            setCanalMeta((old) => ({...old, open: Boolean(props.canalState?.isOpen)}));
        }
    }, [props.canalState?.isOpen]);

    return <CanalWithSpaceWrap
        {...canalAttributes}
        ref={canalRef as MutableRefObject<HTMLDivElement>}
        left={350}
        margin={'-50%'}
    >
        <TopSpace ref={topRef as MutableRefObject<HTMLDivElement>} {...topAttributes} />
        <BottomSpace ref={bottomRef as MutableRefObject<HTMLDivElement>} {...bottomAttributes} />
        <MainImage visible={canalMeta.open} src={images['protein-canal-open']} />

        <span
            css={css`
                position: absolute;
                top: 50%;
                left: calc(50% - 30px);
                font-size: 34px;
                z-index: 1000;
                color: white;
                font-weight: bold;
            `}
        >
            Na⁺
        </span>

        <SecondaryImage
            src={images['protein-canal-close']} visible={!canalMeta.open} />
    </CanalWithSpaceWrap>;
}

function SinapsKCanal(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;
    const [canalMeta, setCanalMeta] = useState({type: canal, id: `${canal}-${index}`, open: false});
    const [topMeta, setTopMeta] = useState({
        type: `${canal}-top`,
        id: `${canalMeta.id}-top-${index}`,
        parentId: canalMeta.id,
    });
    const [bottomMeta, setBottomMeta] = useState({
        type: `${canal}-bottom`,
        id: `${canalMeta.id}-bottom-${index}`,
        parentId: canalMeta.id,
    });

    const {ref: canalRef, attributes: canalAttributes} = useDrop(canalMeta.id, canalMeta);
    const {ref: topRef, attributes: topAttributes} = useDrop(topMeta.id, topMeta);
    const {ref: bottomRef, attributes: bottomAttributes} = useDrop(bottomMeta.id, bottomMeta);

    const outerCanalRef = useEnhancedRef(canalRef, {setMeta: setCanalMeta});
    const outerTopRef = useEnhancedRef(topRef, {setMeta: setTopMeta});
    const outerBottomRef = useEnhancedRef(bottomRef, {setMeta: setBottomMeta});

    useSetUnsetRef(outerCanalRef, setRef, unsetRef, canalMeta.id);
    useSetUnsetRef(outerTopRef, setRef, unsetRef, topMeta.id);
    useSetUnsetRef(outerBottomRef, setRef, unsetRef, bottomMeta.id);

    useEffect(() => {
        if (Boolean(props.canalState?.isOpen) !== canalMeta.open) {
            setCanalMeta((old) => ({...old, open: Boolean(props.canalState?.isOpen)}));
        }
    }, [props.canalState?.isOpen]);

    return <CanalWithSpaceWrap
        {...canalAttributes}
        ref={canalRef as MutableRefObject<HTMLDivElement>}
        flip={true}
        margin={'-50%'}
    >
        <TopSpace ref={topRef as MutableRefObject<HTMLDivElement>} {...topAttributes} />
        <BottomSpace ref={bottomRef as MutableRefObject<HTMLDivElement>} {...bottomAttributes} />
        <MainImage visible={canalMeta.open} src={images['protein-canal-open']} />

        <span
            css={css`
                position: absolute;
                top: 40%;
                left: calc(50% - 20px);
                font-size: 34px;
                z-index: 1000;
                color: white;
                font-weight: bold;
                transform: rotate(180deg);
            `}
        >
            K⁺
        </span>

        <SecondaryImage
            src={images['protein-canal-close']} visible={!canalMeta.open} />
    </CanalWithSpaceWrap>;
}

function CarrierCanal(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;
    const [canalMeta, setCanalMeta] = useState({type: canal, id: `${canal}-${index}`});
    const [topMeta, setTopMeta] = useState({
        type: `${canal}-top`,
        id: `${canalMeta.id}-top-${index}`,
        parentId: canalMeta.id,
    });
    const [bottomMeta, setBottomMeta] = useState({
        type: `${canal}-bottom`,
        id: `${canalMeta.id}-bottom-${index}`,
        parentId: canalMeta.id,
    });

    const {ref: canalRef, attributes: canalAttributes} = useDrop(canalMeta.id, canalMeta);
    const {ref: topRef, attributes: topAttributes} = useDrop(topMeta.id, topMeta);
    const {ref: bottomRef, attributes: bottomAttributes} = useDrop(bottomMeta.id, bottomMeta);

    const outerCanalRef = useEnhancedRef(canalRef, {setMeta: setCanalMeta});
    const outerTopRef = useEnhancedRef(topRef, {setMeta: setTopMeta});
    const outerBottomRef = useEnhancedRef(bottomRef, {setMeta: setBottomMeta});

    useSetUnsetRef(outerCanalRef, setRef, unsetRef, canalMeta.id);
    useSetUnsetRef(outerTopRef, setRef, unsetRef, topMeta.id);
    useSetUnsetRef(outerBottomRef, setRef, unsetRef, bottomMeta.id);

    return <CanalWithSpaceWrap>
        <TopSpace ref={topRef as MutableRefObject<HTMLDivElement>} {...topAttributes} />
        <BottomSpace ref={bottomRef as MutableRefObject<HTMLDivElement>} {...bottomAttributes} />
        <img
            ref={canalRef as MutableRefObject<HTMLImageElement>}
            src={images[canal]}
            {...canalAttributes}
        />
    </CanalWithSpaceWrap>;
}

function PumpCanal(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;
    const [commonMeta, setCommonMeta] = useState<{step: number; atomIds: string[]}>({step: 0, atomIds: []});
    const [canalMeta, setCanalMeta] = useState({type: canal, id: `${canal}-${index}`, ...commonMeta});
    const [topMeta, setTopMeta] = useState({
        type: `${canal}-top`,
        id: `${canalMeta.id}-top-${index}`,
        parentId: canalMeta.id,
        ...commonMeta,
    });
    const [bottomMeta, setBottomMeta] = useState({
        type: `${canal}-bottom`,
        id: `${canalMeta.id}-bottom-${index}`,
        parentId: canalMeta.id,
        ...commonMeta,
    });

    useEffect(() => {
        setCanalMeta((old) => ({...old, ...commonMeta}));
        setTopMeta((old) => ({...old, ...commonMeta}));
        setBottomMeta((old) => ({...old, ...commonMeta}));
    }, [commonMeta]);

    const {ref: canalRef, attributes: canalAttributes} = useDrop(canalMeta.id, canalMeta);
    const {ref: topRef, attributes: topAttributes} = useDrop(topMeta.id, topMeta);
    const {ref: bottomRef, attributes: bottomAttributes} = useDrop(bottomMeta.id, bottomMeta);

    const outerCanalRef = useEnhancedRef(canalRef, {setMeta: setCommonMeta});
    const outerTopRef = useEnhancedRef(topRef, {setMeta: setCommonMeta});
    const outerBottomRef = useEnhancedRef(bottomRef, {setMeta: setCommonMeta});

    useSetUnsetRef(outerCanalRef, setRef, unsetRef, canalMeta.id);
    useSetUnsetRef(outerTopRef, setRef, unsetRef, topMeta.id);
    useSetUnsetRef(outerBottomRef, setRef, unsetRef, bottomMeta.id);

    return <CanalWithSpaceWrap
        {...canalAttributes}
        ref={canalRef as MutableRefObject<HTMLDivElement>}
    >
        <TopSpace ref={topRef as MutableRefObject<HTMLDivElement>} {...topAttributes} />
        <BottomSpace ref={bottomRef as MutableRefObject<HTMLDivElement>} {...bottomAttributes} />
        <MainImage
            visible={[0, 1, 2].includes(commonMeta.step)}
            src={images['pump-1']}
        />
        <SecondaryImage
            src={images['pump-2']}
            visible={[3].includes(commonMeta.step)}
        />
        <SecondaryImage
            src={images['pump-3']}
            visible={[4, 5].includes(commonMeta.step)}
        />
        <SecondaryImage
            src={images['pump-4']}
            visible={[6].includes(commonMeta.step)}
        />
    </CanalWithSpaceWrap>;
}

function Symproter(props: CanalProps) {
    const {canal, index, setRef, unsetRef, images} = props;
    const [commonMeta, setCommonMeta] = useState<{atomIds: string[]}>({atomIds: []});
    const [canalMeta, setCanalMeta] = useState({type: canal, id: `${canal}-${index}`, ...commonMeta});
    const [topMeta, setTopMeta] = useState({
        type: `${canal}-top`,
        id: `${canalMeta.id}-top-${index}`,
        parentId: canalMeta.id,
        ...commonMeta,
    });
    const [bottomMeta, setBottomMeta] = useState({
        type: `${canal}-bottom`,
        id: `${canalMeta.id}-bottom-${index}`,
        parentId: canalMeta.id,
        ...commonMeta,
    });

    useEffect(() => {
        setCanalMeta((old) => ({...old, ...commonMeta}));
        setTopMeta((old) => ({...old, ...commonMeta}));
        setBottomMeta((old) => ({...old, ...commonMeta}));
    }, [commonMeta]);

    const {ref: canalRef, attributes: canalAttributes} = useDrop(canalMeta.id, canalMeta);
    const {ref: topRef, attributes: topAttributes} = useDrop(topMeta.id, topMeta);
    const {ref: bottomRef, attributes: bottomAttributes} = useDrop(bottomMeta.id, bottomMeta);

    const outerCanalRef = useEnhancedRef(canalRef, {setMeta: setCommonMeta});
    const outerTopRef = useEnhancedRef(topRef, {setMeta: setCommonMeta});
    const outerBottomRef = useEnhancedRef(bottomRef, {setMeta: setCommonMeta});

    useSetUnsetRef(outerCanalRef, setRef, unsetRef, canalMeta.id);
    useSetUnsetRef(outerTopRef, setRef, unsetRef, topMeta.id);
    useSetUnsetRef(outerBottomRef, setRef, unsetRef, bottomMeta.id);

    return <CanalWithSpaceWrap>
        <TopSpace ref={topRef as MutableRefObject<HTMLDivElement>} {...topAttributes} />
        <BottomSpace ref={bottomRef as MutableRefObject<HTMLDivElement>} {...bottomAttributes} />
        <img
            {...canalAttributes}
            ref={canalRef as MutableRefObject<HTMLImageElement>}
            src={images.symporter}
        />
    </CanalWithSpaceWrap>;
}

function Canal(props: CanalProps) {
    const {canal} = props;

    switch (canal) {
        case 'aquaporin':
            return <SimpleCanal {...props} />;
        case 'protein-carrier':
            return <CarrierCanal {...props} />;
        case 'protein-canal':
            return <ProteinCanal {...props} />;
        case 'sinaps-na-canal':
            return <SinapsNaCanal {...props} />;
        case 'sinaps-k-canal':
            return <SinapsKCanal {...props} />;
        case 'pump':
            return <PumpCanal {...props} />;
        case 'protein-symporter':
            return <Symproter {...props} />;
        default:
            throw new Error('No component was specified for canal!');
    }
}

export function Membrane(props: MembraneProps) {
    const {highlight, id, setRef, unsetRef, canals, canalsState, images} = props;
    const [meta, setMeta] = useState({type: 'membrane', id});
    const {ref, attributes} = useDrop(id, meta);

    const outerRef = useEnhancedRef(ref, {setMeta});
    useSetUnsetRef(outerRef, setRef, unsetRef, id);

    return <>
        <BaseImg
            {...attributes} highlight={highlight.full}
            ref={ref as MutableRefObject<HTMLDivElement>} source={images.membrane}
        />
        <Highlight draggable='false' show={highlight.usiki} source={images.usiki} />
        <Highlight
            draggable='false' show={highlight.shariki} source={images.shariki}
        />
        <Canals>
            {canals.map((canal, index) =>
                <Canal
                    images={images} key={`${canal}-${index}`} canal={canal}
                    canalState={canalsState[canal]}
                    index={index} setRef={setRef} unsetRef={unsetRef}
                />
            )}
        </Canals>
    </>;
}
