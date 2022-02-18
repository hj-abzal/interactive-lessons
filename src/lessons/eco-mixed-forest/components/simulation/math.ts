import {logger} from '@/utils/logger';

export const totalPopulationPercent = 100;

export function solveOde(x0, I, N, f) {
    const data = [x0];
    const dt = (I[1] - I[0]) / N;

    for (let i = 1; i < N; ++i) {
        const dxdt = data[i - 1][0] + dt * f(0, data[i - 1])[0];
        const dydt = data[i - 1][1] + dt * f(0, data[i - 1])[1];

        data.push([dxdt, dydt]);
    }

    return data;
}

export function ode(startX, startY, a1, a2, a3, b1, b2, b3) {
    // eslint-disable-next-line prefer-rest-params
    logger.debug('ODE_COEFFS', arguments);

    const I = [0, 10];
    const N = 10000;

    const f = function (t, y) {
        // return [
        //     a1 * x + a2 * x * y - a3 * x * x,
        //     b1 * y - b2 * x * y - b3 * y * y
        // ];

        return [
            a1 * y[0] + (a2 * y[0] * y[1]) - (a3 * y[0] * y[0]),
            b1 * y[1] + (b2 * y[0] * y[1]) - (b3 * y[1] * y[1])
        ];
    };

    const x0 = [startX, startY];

    const data = solveOde(x0, I, N, f);

    let q = I[0];
    const h = (I[1] - I[0]) / N;

    for (let i = 0; i < data.length; i++) {
        data[i].push(q);
        q += h;
    }

    return data;
}
