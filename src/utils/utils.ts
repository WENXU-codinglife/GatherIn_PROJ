export const currentMode = (mode: string) => {
  return process.env.NODE_ENV === mode;
};
