export function getThreadIndex() {
  return process.env.pm_id ? parseInt(process.env.pm_id, 10) : undefined;
}
