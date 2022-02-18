export function mathIt(value, modifierString) {
    const valueToOperate = value || 0;
    const modifierToOperate = modifierString || '0';
    const getOperateFunc = {
        '+': function (x, y) {
            return x + y;
        },
        '-': function (x, y) {
            return x - y;
        },
    };
    const firstChar = modifierToOperate.substr(0, 1);
    if (firstChar === '+' || firstChar === '-') {
        return getOperateFunc[firstChar](
            parseInt(valueToOperate, 10),
            parseInt(modifierToOperate.substr(1, modifierToOperate.length), 10)
        );
    } else {
        return parseInt(modifierToOperate, 10);
    }
}

export enum OperatorEnum {
    equal = 'Равно (=)',
    notEqual = 'Не равно (≠)',
    more = 'Больше (>)',
    less = 'Меньше (<)',
    moreOrEqual = 'Больше или равно (>=)',
    lessOrEqual = 'Меньше или равно (<=)',
}

export function compareVars(variable1, operator, variable2) {
    const var1 = typeof variable1 === 'object'
        ? JSON.stringify(variable1)
        : variable1;

    const var2 = typeof variable2 === 'object'
        ? JSON.stringify(variable2)
        : variable2;

    let condition = false;

    switch (operator) {
        case OperatorEnum.equal:
            // eslint-disable-next-line eqeqeq
            condition = var1 == var2;
            break;

        case OperatorEnum.less:
            condition = var1 < var2;
            break;

        case OperatorEnum.lessOrEqual:
            condition = var1 <= var2;
            break;

        case OperatorEnum.more:
            condition = var1 > var2;
            break;

        case OperatorEnum.moreOrEqual:
            condition = var1 >= var2;
            break;

        case OperatorEnum.notEqual:
            // eslint-disable-next-line eqeqeq
            condition = var1 != var2;
            break;

        default:
            break;
    }
    return condition;
}
