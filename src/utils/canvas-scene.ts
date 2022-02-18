import p5Types from 'p5';
import {LittleTimer} from '@/utils/timers';

// callback returns current timeFrame
export type TimerBindFn = () => number;

export class CanvasScene {
    timerBound = false;
    getTime: TimerBindFn | null = null;

    constructor() {
        this.bindTimer = this.bindTimer.bind(this);
    }

    bindTimer(timer: TimerBindFn | LittleTimer) {
        if (typeof timer === 'function') {
            this.getTime = timer;
        } else {
            this.getTime = timer.getTime;
        }
    }

    private get timeFrame() {
        if (!this.getTime) {
            throw new Error(`timer not bound for ${this.constructor.name}`);
        }

        return this.getTime();
    }

    // eslint-disable-next-line
    setup(p5: p5Types) {
        throw new Error(`Method setup should be implemented on ${this.constructor.name}`);
    }

    // eslint-disable-next-line
    draw(p5: p5Types) {
        if (!this.getTime) {
            throw new Error(`
                Method draw should be implemented on ${this.constructor.name} 
                or add timer subscription to use drawByTimer
            `);
        } else {
            throw new Error(`
                Method draw should not be called on ${this.constructor.name} 
                if it's use timer subscription
            `);
        }
    }

    // eslint-disable-next-line
    drawByTimer(p5: p5Types, timeFrame: number) {
        throw new Error(
            `Method drawByTimer should be implemented on ${this.constructor.name} or remove timer subscription`
        );
    }

    get sketch() {
        return {
            setup: this.setup.bind(this),
            draw: (p5) => this.getTime
                ? this.drawByTimer(p5, this.timeFrame)
                : this.draw(p5),
        };
    }
}
