export const serializeOptions = (opts: { name: string; values: string[] }[]) => {
  return opts.map((opt) => `${opt.name}__${opt.values.join('---')}`).join('/+/');
};

// Function to convert string back to array
export const deserializeOptions = (str: string) => {
  if (!str) return [];
  return str.split('/+/').map((opt) => {
    const [name, values] = opt.split('__');
    return { name, values: values ? values.split('---') : [] };
  });
};
