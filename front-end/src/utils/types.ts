export type FormErrors<FormType> = {
    [Key in keyof FormType]: string | undefined
}

export type Normalized<Type> = {
    [key: string]: Type
}

export const normalize = <Type>(objects: Type[], property: keyof Type): Normalized<Type> => {
    const result: Normalized<Type> = {};

    objects.forEach((object: Type) => result[object[property] as unknown as string] = object);

    return result;
};
