const warnHandler = (warning: any) => {
  if (/prefixIcon/.test(warning)) {
    return null;
  }
  console.warn(warning);
};

export default warnHandler;
