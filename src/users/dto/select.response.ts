type TSelectResponse = {
  id: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  isAdmin: boolean;
  name: boolean;
  phoneNumber: boolean;
  orders: {
    include: {
      invitationInfo: boolean;
    };
  };
  activateKey: false;
  role: boolean;
};
export const selectResponse: TSelectResponse = {
  id: true,
  createdAt: true,
  updatedAt: true,
  isAdmin: true,
  name: true,
  phoneNumber: true,
  orders: { include: { invitationInfo: true } },
  activateKey: false,
  role: true,
};
