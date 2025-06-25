export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  fullName: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  birthday: string;
  _id: number;
  updated_at: string;
};
