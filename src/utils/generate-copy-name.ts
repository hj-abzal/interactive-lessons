import {max} from 'lodash';

export const generateCopyName = (name: string, all: string[]) => {
    if (!all.includes(name)) {
        return name;
    }
    const currentNameNumbers: number[] = [];
    const lastDigitRE = /\d+$/;
    const lastSpaceRE = /\s+$/;
    const initialNameWithoutNum = name.replace(lastDigitRE, '').replace(lastSpaceRE, '');
    all.forEach((n) => {
        const numArr = n.match(lastDigitRE);
        if (numArr) {
            const numInString = numArr[0];
            const stringWithoutNum = n.replace(lastDigitRE, '').replace(lastSpaceRE, '');
            if (numInString.length > 0 && stringWithoutNum === initialNameWithoutNum) {
                currentNameNumbers.push(Number(numInString));
            }
        }
    });

    const currentNumber = (max(currentNameNumbers) || 0) + 1;

    return `${initialNameWithoutNum} ${currentNumber}`;
};
