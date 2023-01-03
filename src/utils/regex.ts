export const getFirstGroup = (regexp: RegExp, str: string) => {
    const array = [...str.matchAll(regexp)].map((m) => m[1]);
    if (!array.length) return null;
    return array[0];
  };
  