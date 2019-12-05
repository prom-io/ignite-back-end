export type FormErrors<FormType> = {
    [Key in keyof FormType]: string | undefined
}
