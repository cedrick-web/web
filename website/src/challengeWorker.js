import { executeChallengeTests } from './challengeExecution.js';

// Capture the trusted message sender, then remove APIs the user's submitted code
// should not need. The parent owns the hard execution deadline and terminates us.
const sendResult = self.postMessage.bind(self);
for (const apiName of [
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'BroadcastChannel',
  'MessageChannel', 'Worker', 'SharedWorker', 'importScripts', 'close',
  'setTimeout', 'setInterval', 'setImmediate', 'requestAnimationFrame',
]) {
  try { self[apiName] = undefined; } catch { /* Some browser properties may be read-only. */ }
}
try { self.postMessage = undefined; } catch { /* Use the captured sender regardless. */ }

self.onmessage = (event) => {
  try {
    const challengeId = Number(event?.data?.challengeId);
    const code = typeof event?.data?.code === 'string' ? event.data.code : '';
    const results = executeChallengeTests(challengeId, code);
    sendResult({ type: 'result', results });
  } catch (error) {
    sendResult({
      type: 'result',
      results: [{ pass: false, message: 'Runner error: ' + String(error?.message || 'Unable to run tests.') }],
    });
  }
};
