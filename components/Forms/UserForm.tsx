import { KeyboardTypeOptions, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '../nativewindui/TextField';
import { Text } from '../nativewindui/Text';
import { Picker, PickerItem } from '../nativewindui/Picker';
import { Sheet, useSheetRef } from '../nativewindui/Sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button } from '../nativewindui/Button';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { UPDATE_USER } from '~/lib/mutations/user.mutations';
import { useAuth } from '~/context/AuthContext';
export default function UserForm({ user }: { user?: any }) {
  const { control, reset, formState, getValues } = useFormContext();
  const { setUser } = useAuth();
  const bottomSheetModalRef = useSheetRef();
  const [updateUserMutation, { data, error }] = useMutation(UPDATE_USER);
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);
  const [pickerOptions, setPickerOptions] = useState<{ label: string; value: string }[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

  const genderSelectableOptions = [
    { label: 'Masculino', value: 'Male' },
    { label: 'Femenino', value: 'Female' },
    { label: 'Prefiero no decirlo', value: 'Other' },
  ];

  const inputs = [
    { name: 'name', label: 'Nombre' },
    { name: 'email', label: 'Correo electrónico', keyboardType: 'email-address' },
    { name: 'phone', label: 'Teléfono', keyboardType: 'phone-pad' },
    { name: 'lastname', label: 'Apellido' },
    {
      name: 'gender',
      label: 'Género',
      type: 'picker',
      options: genderSelectableOptions,
      placeholder: 'Selecciona tu género',
    },
  ];

  const handleOpenPicker = (
    fieldName: string,
    options: { label: string; value: string }[],
    currentLabel: string
  ) => {
    Keyboard.dismiss();
    setSelectedPicker(fieldName);
    setPickerOptions(options);
    const matched = options.find((o) => o.label === currentLabel);
    setCurrentValue(matched?.value);
    bottomSheetModalRef.current?.present();
  };

  const parsePickerValue = (inputName: string, label: string): string => {
    if (inputName === 'gender') {
      return genderSelectableOptions.find((option) => option.label === label)?.value || '';
    }
    return label;
  };

  const submit = async () => {
    const values = getValues();
    const updatedUser = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      lastname: values.lastname,
      gender: parsePickerValue('gender', values.gender),
    };
    await updateUserMutation({
      variables: {
        input: {
          ...updatedUser,
        },
      },
    });
    // handle updatedUser as needed
  };

  useEffect(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      lastname: user?.lastname || '',
      gender: user?.gender
        ? genderSelectableOptions.find((option) => option.value === user.gender)?.label || ''
        : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      console.log('User updated successfully:', data);
      Toast.show({
        type: 'success',
        text1: 'Información actualizada',
        text2: `Tu información ha sido actualizada correctamente.`,
      });
      reset({
        name: data.updateUser.name,
        email: data.updateUser.email,
        phone: data.updateUser.phone,
        lastname: data.updateUser.lastname,
        gender:
          genderSelectableOptions.find((option) => option.value === data.updateUser.gender)
            ?.label || '',
      });
      setUser({
        ...user,
        ...data.updateUser,
      });
    }
    if (error) {
      console.error('Error updating user:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, reset]);

  return (
    <>
      <Form className="ios:bg-background">
        <FormSection>
          {inputs.map((input) => (
            <Controller
              key={input.name}
              name={input.name}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <TextField
                    {...(input.type === 'picker'
                      ? {
                          onPress: () => {
                            const options = input.options || [];
                            handleOpenPicker(input.name, options, field.value);
                          },
                          readOnly: true,
                        }
                      : {
                          onChangeText: field.onChange,
                        })}
                    onBlur={field.onBlur}
                    labelClassName="dark:text-neutral-400"
                    label={input.label}
                    value={field.value}
                    keyboardType={input.keyboardType as KeyboardTypeOptions}
                    placeholder={input.placeholder}
                  />
                </FormItem>
              )}
            />
          ))}
        </FormSection>
      </Form>
      {formState.isDirty && (
        <Button className="mt-6" size="lg" onPress={submit}>
          <Text>Guardar cambios</Text>
        </Button>
      )}
      <Sheet ref={bottomSheetModalRef} snapPoints={[500]}>
        <BottomSheetView className="px-4">
          {selectedPicker && (
            <Controller
              name={selectedPicker}
              control={control}
              render={({ field }) => (
                <Picker
                  selectedValue={currentValue}
                  onValueChange={(value) => {
                    const selected = pickerOptions.find((opt) => opt.value === value);
                    const label = selected?.label ?? '';
                    field.onChange(label);
                    setCurrentValue(value);
                    bottomSheetModalRef.current?.dismiss();
                  }}>
                  {pickerOptions.map((option) => (
                    <PickerItem key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              )}
            />
          )}
        </BottomSheetView>
      </Sheet>
    </>
  );
}
