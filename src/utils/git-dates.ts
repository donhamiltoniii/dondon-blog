import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';

/**
 * Returns the ISO timestamp of the last modification to a file.
 * Uses git commit date when the file is clean, filesystem mtime when
 * there are uncommitted changes (so dev previews reflect live edits).
 */
export function gitLastModified(filePath: string): string {
  try {
    const dirty =
      execSync(`git status --porcelain -- "${filePath}"`, {
        encoding: 'utf-8',
      }).trim().length > 0;

    if (dirty) {
      return statSync(filePath).mtime.toISOString();
    }

    const committed = execSync(`git log --format=%aI -1 -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();

    return committed || statSync(filePath).mtime.toISOString();
  } catch {
    // not a git repo, file untracked, git unavailable in CI, etc.
    return new Date().toISOString();
  }
}
