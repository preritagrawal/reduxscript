export const camelToUpperSnake = (camelCase) => camelCase.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();

export const camelToPascal = (camelCase) => camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
