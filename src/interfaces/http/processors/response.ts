export const ok = (message: string, data: any) => ({
  status: '200',
  message: message || 'Success',
  data,
});
