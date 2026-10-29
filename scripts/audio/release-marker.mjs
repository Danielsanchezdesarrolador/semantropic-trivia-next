import { execFileSync } from 'node:child_process';
export function releaseMarker() {
  return { name: 'semantropic-release-marker', apply: 'build', generateBundle() {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    if (!/^[a-f0-9]{40}$/.test(commit)) throw Error('No se pudo identificar commit del build');
    this.emitFile({ type: 'asset', fileName: 'release.json', source: JSON.stringify({
      commit, stage: 'B03-C5', audio: ['M1', 'V1', 'A1', 'X3', 'L7', 'C', 'CLK'],
    }) });
  } };
}
