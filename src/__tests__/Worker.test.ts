import { executeWorker } from '../index';

test('execute worker', () => {
    expect(executeWorker()).toBe("success");
});