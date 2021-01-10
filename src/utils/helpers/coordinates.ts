export const getCoordinatesFromArgs = (args: string[]): { gal: Number; sys: Number; pos: Number } | undefined => {
  let coordinates = args.find((v) => v.match(/\[*[1-4]:[0-9]{1,3}:[0-9]{1,2}\]*/));

  if (!coordinates.length) {
    return undefined;
  }

  coordinates = coordinates.replace('[', '');
  coordinates = coordinates.replace(']', '');

  const splittedCoordinates = coordinates.split(':');

  return {
    gal: Number(splittedCoordinates[0]),
    sys: Number(splittedCoordinates[1]),
    pos: Number(splittedCoordinates[2]),
  };
};
