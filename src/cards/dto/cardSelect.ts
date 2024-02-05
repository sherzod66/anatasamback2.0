type TSelectResponse = {
  id: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  name: boolean;
  description: boolean;
  price: boolean;
  orders: boolean;
  type: boolean;
  imageLink: boolean;
  quantity: boolean;
  minOrderQuantity: boolean;
};

export const cardSelect: TSelectResponse = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  description: true,
  price: true,
  orders: true,
  type: true,
  imageLink: true,
  quantity: true,
  minOrderQuantity: true,
};
