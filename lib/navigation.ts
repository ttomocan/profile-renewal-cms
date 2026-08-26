const normalizePath = (path: string) => {
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
};

export function isCurrentPath(pathname: string, targetPath: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(targetPath);

  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}
