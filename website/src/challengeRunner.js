const EXECUTION_TIMEOUT_MS = 1_500;

function runnerFailure(message) {
  return [{ pass: false, message }];
}

export function runChallengeInWorker(challenge, code) {
  return new Promise((resolve) => {
    let worker;
    let settled = false;
    let timeout;

    const finish = (results) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (worker) {
        worker.onmessage = null;
        worker.onerror = null;
        worker.terminate();
      }
      resolve(Array.isArray(results) ? results : runnerFailure('The runner returned an invalid response.'));
    };

    try {
      if (typeof Worker === 'undefined') {
        finish(runnerFailure('This browser does not support isolated code execution. Update the browser or try another one.'));
        return;
      }

      worker = new Worker(new URL('./challengeWorker.js', import.meta.url), {
        type: 'module',
        name: 'devsprint-challenge-runner',
      });

      timeout = setTimeout(() => {
        finish(runnerFailure('Execution stopped after 1.5 seconds. Check for an infinite loop or an unusually slow solution.'));
      }, EXECUTION_TIMEOUT_MS);

      worker.onmessage = (event) => {
        if (event?.data?.type === 'result') finish(event.data.results);
      };
      worker.onerror = (event) => {
        event?.preventDefault?.();
        finish(runnerFailure('The isolated runner could not execute this submission. Check the syntax and try again.'));
      };
      worker.postMessage({ challengeId: Number(challenge?.id), code: typeof code === 'string' ? code : '' });
    } catch (error) {
      finish(runnerFailure('Could not start the isolated runner: ' + String(error?.message || 'Worker startup failed.')));
    }
  });
}
