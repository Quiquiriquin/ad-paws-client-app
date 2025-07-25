import { View, KeyboardTypeOptions, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '../nativewindui/TextField';
import { Text } from '../nativewindui/Text';
import { dogBreedSelectableOptions } from '~/utils/breed.catalog';
import { dogSizeOptions } from '~/utils/size.catalog';
import { Picker, PickerItem } from '../nativewindui/Picker';
import { Sheet, useSheetRef } from '../nativewindui/Sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';

export default function PetForm({ dog }: { dog?: any }) {
  const { control, reset } = useFormContext();
  const bottomSheetModalRef = useSheetRef();
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);
  const [pickerOptions, setPickerOptions] = useState<{ label: string; value: string }[]>([]);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    reset({
      name: dog?.name || '',
      breed: dog?.breed
        ? dogBreedSelectableOptions.find((option) => option.value === dog.breed)?.label || ''
        : '',
      color: dog?.color || '',
      size: dog?.size
        ? dogSizeOptions.find((option) => option.value === dog.size)?.label || ''
        : '',
      age: dog?.age ? String(dog.age) : '',
      weight: dog?.weight ? String(dog.weight) : '0',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputs = [
    { name: 'name', label: 'Nombre', placeholder: 'Nombre de tu mascota' },
    { name: 'breed', placeholder: 'Raza de tu mascota', type: 'picker', label: 'Raza' },
    { name: 'color', label: 'Color', placeholder: 'Color de tu mascota' },
    { name: 'size', type: 'picker', label: 'Tamaño', placeholder: 'Tamaño de tu mascota' },
    {
      name: 'age',
      label: 'Edad',
      keyboardType: 'numeric',
      placeholder: 'Edad de tu mascota',
      rightView: (
        <View className="justify-center pr-3">
          <Text>años</Text>
        </View>
      ),
    },
    {
      name: 'weight',
      label: 'Peso',
      placeholder: 'Peso de tu mascota',
      keyboardType: 'numeric',
      rightView: (
        <View className="justify-center pr-3">
          <Text>kg</Text>
        </View>
      ),
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
                            const options =
                              input.name === 'breed' ? dogBreedSelectableOptions : dogSizeOptions;
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
                    rightView={input.rightView}
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
