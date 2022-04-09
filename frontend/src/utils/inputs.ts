export const onInputChange =
  (setValue: (value: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value)
