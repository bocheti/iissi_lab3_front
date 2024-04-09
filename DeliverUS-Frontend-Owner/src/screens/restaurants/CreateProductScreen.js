/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Pressable, Image, Platform, Switch } from 'react-native'
import * as ExpoImagePicker from 'expo-image-picker'
import TextRegular from '../../components/TextRegular'
import InputItem from '../../components/InputItem'
import product from '../../../assets/product.jpeg'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { Formik } from 'formik'
import DropDownPicker from 'react-native-dropdown-picker'
import { get } from '../../api/helpers/ApiRequestsHelper'

import { showMessage } from 'react-native-flash-message'

export default function CreateProductScreen () {
  const initialProductValues = { name: null, description: null, price: null, image: null, order: null, productCategory: null, availability: null }
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])
  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  const [productCategories, setProductCategories] = useState([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    async function fetchProductCategories () {
      try {
        const fetchedProductCategories = await get('productCategories')
        const fetchedProductCategoriesReshaped = fetchedProductCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setProductCategories(fetchedProductCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProductCategories()
  }, [])
  return (
    <Formik initialValues={initialProductValues}>
      {({ setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <DropDownPicker
                open={open}
                value={values.productCategoryId}
                items={productCategories}
                setOpen={setOpen}
                onSelectItem={ item => {
                  setFieldValue('productCategoryId', item.value)
                }}
                setItems={setProductCategories}
                placeholder="Select the product category"
                containerStyle={{ height: 40, marginTop: 20, marginBottom: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />
              <InputItem
                name='name'
                label='name'
              />
              <InputItem
                name='description'
                label='description'
              />
              <InputItem
                name='price'
                label='price'
              />
              <InputItem
                name='image'
                label='image'
              />
              <InputItem
                name='order '
                label='order '
              />
              <InputItem
                name='productCategory'
                label='productCategory'
              />
              <InputItem
                name='availability'
                label='availability'
              />
              <TextRegular style={{ marginTop: 40 }}>Is it available?</TextRegular>
              <Switch
                trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
                value={values.availability}
                style={{ marginTop: 20 }}
                onValueChange={value =>
                  setFieldValue('availability', value)
                }
              />
              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('logo', result)
                  }
                )
              }
                style={styles.imagePicker}>
                <View style={{ alignItems: 'center', marginBottom: '1em' }}>
                  <TextRegular >Product image: </TextRegular>
                </View>
                <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : product} />
              </Pressable>
              <Pressable
                onPress={() => console.log('Button pressed')
                }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.button
                ]}>
                  <TextRegular textStyle={styles.text}>
                    Create product
                  </TextRegular>
                </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.brandSecondary,
    textAlign: 'center'
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 100
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})
