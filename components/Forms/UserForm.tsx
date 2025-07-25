import { KeyboardTypeOptions, Keyboard } from 'react-native';
import { useState } from 'react';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '../nativewindui/TextField';

import { Picker, PickerItem } from '../nativewindui/Picker';
import { Sheet, useSheetRef } from '../nativewindui/Sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';

export const genderSelectableOptions = [
  { label: 'Masculino', value: 'Male' },
  { label: 'Femenino', value: 'Female' },
  { label: 'Prefiero no decirlo', value: 'Other' },
];

export default function UserForm({ user }: { user?: any }) {
  const { control } = useFormContext();
  const bottomSheetModalRef = useSheetRef();
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);
  const [pickerOptions, setPickerOptions] = useState<{ label: string; value: string }[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

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
