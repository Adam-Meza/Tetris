interface FormInputProps {
  value: string;
  setter: (value: string) => void;
  name: string;
}

export const FormInput: React.FC<FormInputProps> = (
  props
) => {
  const { value, setter, name } = props;

  return (
    <input
      autoComplete='false'
      name='password-confirmation'
      className='form-input'
      type={name === 'password' ? 'text' : name}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setter(e.target.value)
      }
    />
  );
};
