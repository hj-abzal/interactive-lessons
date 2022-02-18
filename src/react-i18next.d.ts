import 'react-i18next';
import ekologiyaSoobshchestvIBiosfera from './codgen/tanker/ru/ekologiyaSoobshchestvIBiosfera.json';
import kletkaIYeeStroenie from './codgen/tanker/ru/kletkaIYeeStroenie.json';
import mirGlazamiDrugikh from './codgen/tanker/ru/mirGlazamiDrugikh.json';
import neirogumoralnayaRegulyatsiya from './codgen/tanker/ru/neirogumoralnayaRegulyatsiya.json';
import nervnayaSistemaMekhanizmNervnogoImpulsa from './codgen/tanker/ru/nervnayaSistemaMekhanizmNervnogoImpulsa.json';
import obshchee from './codgen/tanker/ru/obshchee.json';
import prosteishieStroenie from './codgen/tanker/ru/prosteishieStroenie.json';
import shablon from './codgen/tanker/ru/shablon.json';
import skeletChelovekaYegoStroenieIFunktsii from './codgen/tanker/ru/skeletChelovekaYegoStroenieIFunktsii.json';
import strukturaOrganizmaChelovekaTkani from './codgen/tanker/ru/strukturaOrganizmaChelovekaTkani.json';
import svoistvaMembrani from './codgen/tanker/ru/svoistvaMembrani.json';
import tkaniRastenii from './codgen/tanker/ru/tkaniRastenii.json';

const resources = {
    ekologiyaSoobshchestvIBiosfera,
    kletkaIYeeStroenie,
    mirGlazamiDrugikh,
    neirogumoralnayaRegulyatsiya,
    nervnayaSistemaMekhanizmNervnogoImpulsa,
    obshchee,
    prosteishieStroenie,
    shablon,
    skeletChelovekaYegoStroenieIFunktsii,
    strukturaOrganizmaChelovekaTkani,
    svoistvaMembrani,
    tkaniRastenii,
};

export const resourcesIds: (keyof typeof resources)[] = Object.keys(resources);

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'obshchee';
    resources: typeof resources;
  }
}
