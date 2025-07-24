export const dogSizes = {
  TOY: 'Miniatura',
  SMALL: 'Pequeño',
  MEDIUM: 'Mediano',
  LARGE: 'Grande',
  GIGANTIC: 'Gigante',
};

export const dogSizeOptions = Object.entries(dogSizes).map(([value, label]) => ({
  value,
  label,
}));
