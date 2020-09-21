
const renderEach = (imList, sideEffect) => {
  if (!sideEffect || !imList || imList.size === 0) {
    return null;
  }
  const renderResults = [];
  imList.forEach((item, index) => {
    const result = sideEffect(item, index);
    if (result) {
      renderResults.push(result);
    }
    return true;
  });
  return renderResults;
};

const listTristate = (condition, states) => {
  const { init, empty, normal } = states;
  if (!condition) {
    return init;
  }
  if (condition && condition.size === 0) {
    return empty;
  }
  return normal;
};

export { listTristate, renderEach };
