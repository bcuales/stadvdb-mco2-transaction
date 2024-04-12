import('chai').then(chai => {
    const { expect } = chai;
const { simulateCentralNodeCrash } = require('./db');

describe('Simulation Tests', () => {
  let clock;
  let consoleSpy;

  beforeEach(() => {
    clock = sinon.useFakeTimers(); // fake timers for control setTimeout
    consoleSpy = sinon.spy(console, 'log'); 
  });

  afterEach(() => {
    clock.restore(); // restore original timers after test
    consoleSpy.restore(); 
  });

  it('should simulate central node crash and recovery', async () => {
    simulateCentralNodeCrash();
    expect(consoleSpy.calledWith('Simulating Central Node crash')).to.be.true;
    clock.tick(5000); // 5 seconds
    expect(consoleSpy.calledWith('Central Node back online.')).to.be.true;
  });
});
});
