// Same clock for the engine and its visual arc: wall time covers suspension,
// while the monotonic reference prevents a clock rollback adding seconds.
export const localNow = () => Math.max(Date.now(), performance.timeOrigin + performance.now());
