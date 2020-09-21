
const ensureStringArray = (val) => {
  return (val && typeof val === 'string') ? [val] : val;
}

export { ensureStringArray }
