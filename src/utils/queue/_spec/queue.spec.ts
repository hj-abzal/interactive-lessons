import {queue, stack} from '../index';

describe('queue', () => {
    describe('алгоритм lifo (stack)', () => {
        it('правильно работает push/pop', () => {
            const q = stack();

            const items = [1, 2, 3];

            q.push(items[0]);
            q.push(items[2]);
            q.push(items[1]);

            expect(q.len()).toBe(3);

            expect(q.pop()).toBe(2);
            expect(q.len()).toBe(2);

            expect(q.pop()).toBe(3);
            expect(q.len()).toBe(1);

            expect(q.pop()).toBe(1);
            expect(q.len()).toBe(0);

            expect(() => q.pop()).toThrow('out of range on 4 pop');
        });

        it('правильно работает pushMany/pop', () => {
            const q = stack();

            const items = [1, 2];

            q.pushMany(items);

            expect(q.len()).toBe(2);
            expect(q.pop()).toBe(items[1]);
            expect(q.len()).toBe(1);
            expect(q.pop()).toBe(items[0]);
            expect(q.len()).toBe(0);

            expect(() => q.pop()).toThrow('out of range on 3 pop');
        });

        it('можно юзать после очистки', () => {
            const q = stack();

            const items = [1, 2];

            q.pushMany(items);

            q.pop();

            q.flush();
            expect(q.len()).toBe(0);

            q.pushMany(items);

            expect(q.len()).toBe(2);
            expect(q.pop()).toBe(items[1]);
        });

        it('должен отдавать новый объект из pop', () => {
            const q = stack();

            const items = [{a: '1'}];

            q.pushMany(items);

            expect(q.pop()).not.toBe(items[0]);
        });
    });

    describe('алгоритм fifo (queue)', () => {
        it('правильно работает push/pop', () => {
            const q = queue();

            const items = [1, 2];

            q.push(items[0]);
            q.push(items[1]);

            expect(q.len()).toBe(2);
            expect(q.pop()).toBe(items[0]);
            expect(q.len()).toBe(1);
            expect(q.pop()).toBe(items[1]);
            expect(q.len()).toBe(0);
        });

        it('правильно работает pushMany/pop', () => {
            const q = queue();

            const items = [1, 2];

            q.pushMany(items);

            expect(q.len()).toBe(2);
            expect(q.pop()).toBe(items[0]);
            expect(q.len()).toBe(1);
            expect(q.pop()).toBe(items[1]);
            expect(q.len()).toBe(0);
        });
    });

    it('можно юзать после очистки', () => {
        const q = queue();

        const items = [1, 2];

        q.pushMany(items);

        q.pop();

        q.flush();
        expect(q.len()).toBe(0);

        q.pushMany(items);

        expect(q.len()).toBe(2);
        expect(q.pop()).toBe(items[0]);
    });

    it('должен отдавать новый объект из pop', () => {
        const q = queue();

        const items = [{a: '1'}];

        q.pushMany(items);

        expect(q.pop()).not.toBe(items[0]);
    });
});
