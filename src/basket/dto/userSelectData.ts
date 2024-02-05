type TBasketSelect = {
  activateKey: false;
  basket: true;
  id: true;
  name: true;
  isAdmin: true;
  orders: false;
  phoneNumber: true;
};
export const basketSelect: TBasketSelect = {
  id: true,
  activateKey: false,
  name: true,
  isAdmin: true,
  phoneNumber: true,
  orders: false,
  basket: true,
};
