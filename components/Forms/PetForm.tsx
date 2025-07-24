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
import { Button } from '../nativewindui/Button';
import { useMutation } from '@apollo/client';
import { UPDATE_DOG } from '~/lib/mutations/dog.mutations';
import Toast from 'react-native-toast-message';
export default function PetForm({ dog }: { dog?: any }) {
  const { control, reset, formState, getValues } = useFormContext();
  const bottomSheetModalRef = useSheetRef();
  const [updateDogMutation, { data, loading, error }] = useMutation(UPDATE_DOG);
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
  }, []);

  const inputs = [
    { name: 'name', label: 'Nombre' },
    { name: 'breed', type: 'picker', label: 'Raza' },
    { name: 'color', label: 'Color' },
    { name: 'size', type: 'picker', label: 'Tamaño' },
    {
      name: 'age',
      label: 'Edad',
      keyboardType: 'numeric',
      rightView: (
        <View className="justify-center pr-3">
          <Text>años</Text>
        </View>
      ),
    },
    {
      name: 'weight',
      label: 'Peso',
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

  const parsePickerValue = (inputName: string, label: string): string => {
    if (inputName === 'breed') {
      return dogBreedSelectableOptions.find((option) => option.label === label)?.value || '';
    }
    if (inputName === 'size') {
      return dogSizeOptions.find((option) => option.label === label)?.value || '';
    }
    return label;
  };

  const submit = async () => {
    const values = getValues();
    const updatedDog = {
      name: values.name,
      breed: parsePickerValue('breed', values.breed),
      color: values.color,
      size: parsePickerValue('size', values.size),
      age: parseInt(values.age, 10),
      weight: parseFloat(values.weight),
    };
    console.log('Updated Dog:', updatedDog);
    await updateDogMutation({
      variables: {
        input: {
          id: parseInt(dog.id, 10),
          ...updatedDog,
        },
      },
    });
    // handle updatedDog as needed
  };

  useEffect(() => {
    if (data) {
      console.log('Dog updated successfully:', data);
      Toast.show({
        type: 'success',
        text1: 'Información actualizada',
        text2: `La información de ${data.updateDog.name} ha sido actualizada correctamente.`,
      });
      reset({
        name: data.updateDog.name,
        breed:
          dogBreedSelectableOptions.find((option) => option.value === data.updateDog.breed)
            ?.label || '',
        color: data.updateDog.color,
        size: dogSizeOptions.find((option) => option.value === data.updateDog.size)?.label || '',
        age: String(data.updateDog.age),
        weight: String(data.updateDog.weight),
      });
    }
    if (error) {
      console.error('Error updating dog:', error);
    }
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
