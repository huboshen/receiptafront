import axios from './axiosConfig';
import { ImageResult } from 'expo-image-manipulator';

export const submitReceipts = async (receiptFiles: ImageResult[]) => {
    try {
        console.log('Submitting receipt data...');
        const response = await axios.post('api/parse-receipt-images', {
            abc: 'def',
        });
        console.log('response', response.data)
        return response.data;
    } catch (error) {
        console.error('Error when submitting receipt data: ', error);
    }
}