import React, { useState, } from 'react';
import { Button, View, StyleSheet, Image, ActivityIndicator, } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { manipulateAsync, SaveFormat, ImageResult } from 'expo-image-manipulator';
import { submitReceipts } from '../api/receiptService';
import { userLogin } from '../api/userService';


export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [receiptFiles, setReceiptFiles] = useState<ImageResult[]>([]);
  
    const pickReceiptFiles = async () => {
      let result = await DocumentPicker.getDocumentAsync({
        type:  'image/*',
        multiple: true,
      });
  
      if (result.canceled === false) {
        
        setIsLoading(true);
        
        if ((receiptFiles.length + result.assets.length) > 5) {
            alert('You can only add up to 5 files.'); // TODO: Show a better UI
        }

        const fileSlotsLeft = 5 - receiptFiles.length;

        // Limit the number of files to 5
        if (fileSlotsLeft > 0) {
            if (result.assets.length == fileSlotsLeft) {
                result.assets = result.assets.slice(0, fileSlotsLeft);
            }
        } else {
          result.assets = []; 
        }

        // Resize and compress the image to 1000px width and 50% quality
        let validFiles = await Promise.all(result.assets.map(async (file) => {
          return await manipulateAsync(file.uri, [{ resize: { width: 1000 } }], 
            { compress: 0.5, format: SaveFormat.PNG });
        }));
   
        setReceiptFiles([...receiptFiles, ...validFiles]);
        
        setIsLoading(false); 
      }
    }

    return (
        <View style={styles.content}>
            <Button title="Log In" onPress={userLogin}></Button>
            <Button title="Pick Receipt Images" onPress={pickReceiptFiles} />
            {receiptFiles.map((file, index) => (
                <View key={index}>
                    <Image source={{ uri: file.uri }} style={{ width: 100, height: 100 }} />
                    <Button title="Remove" disabled={isLoading} onPress={() => {
                        setReceiptFiles(prevFiles => prevFiles.filter((_, fileIndex) => fileIndex !== index));
                    }} />
                </View>
            ))}

            <ActivityIndicator animating={isLoading} size="large" color="#0000ff" />

            {receiptFiles.length > 0 && (
                <Button title="Submit" disabled={isLoading} onPress={() => submitReceipts(receiptFiles)} />
            )}
        </View>
      )
};

const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }); 