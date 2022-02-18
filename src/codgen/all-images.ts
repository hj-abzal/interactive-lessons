import {get} from 'lodash';
import common from '@/codgen/common';
import ekosistemaOtkritiiOkean from '@/codgen/ekosistemaOtkritiiOkean';
import ekosistemaSmeshanniiLes from '@/codgen/ekosistemaSmeshanniiLes';
import kletkaIYeyoStroenie from '@/codgen/kletkaIYeyoStroenie';
import mirGlazamiDrugikh from '@/codgen/mirGlazamiDrugikh';
import prosteishieStroenie from '@/codgen/prosteishieStroenie';
import tkaniCheloveka from '@/codgen/tkaniCheloveka';
import svoistvaMembrani from '@/codgen/svoistvaMembrani';
import polkaOrganoidi from '@/codgen/polkaOrganoidi';
import khimicheskieElementi from '@/codgen/khimicheskieElementi';
import anatomiya from '@/codgen/anatomiya';
import skeletCheloveka from '@/codgen/skeletCheloveka';
import neirogumoralnayaRegulyatsiya from './neirogumoralnayaRegulyatsiya';
import tkaniRastenii from '@/codgen/tkaniRastenii';
import nervnayaSistema from './nervnayaSistema';
import rasteniyaOrgani from './rasteniyaOrgani';
import molekulyarnayaBiologiyaMitozMeioz from './molekulyarnayaBiologiyaMitozMeioz';
import molekulyarnayaBiologiyaFotosintezDikhanieIBrozhenie from './molekulyarnayaBiologiyaFotosintezDikhanieIBrozhenie';
import prosteishieZhiznennieTsikli from './prosteishieZhiznennieTsikli';
import proiskhozhdenieIRazvitieZhizniNaZemle from './proiskhozhdenieIRazvitieZhizniNaZemle';
import visshieSporovieRasteniyaZhiznennieTsikli from './visshieSporovieRasteniyaZhiznennieTsikli';

const images = {
    common,
    ekosistemaSmeshanniiLes,
    ekosistemaOtkritiiOkean,
    mirGlazamiDrugikh,
    polkaOrganoidi,
    kletkaIYeyoStroenie,
    prosteishieStroenie,
    tkaniCheloveka,
    khimicheskieElementi,
    svoistvaMembrani,
    anatomiya,
    skeletCheloveka,
    neirogumoralnayaRegulyatsiya,
    tkaniRastenii,
    rasteniyaOrgani,
    nervnayaSistema,
    molekulyarnayaBiologiyaMitozMeioz,
    molekulyarnayaBiologiyaFotosintezDikhanieIBrozhenie,
    prosteishieZhiznennieTsikli,
    proiskhozhdenieIRazvitieZhizniNaZemle,
    visshieSporovieRasteniyaZhiznennieTsikli,
};

export const getImage = (path) => {
    return get(images, path);
};

export default images;
