export const isDefined = <T>(value: T): value is NonNullable<T> => {
    return value !== undefined && value !== null;
};

export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};
