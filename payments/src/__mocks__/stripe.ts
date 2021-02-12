export const stripe = {
  charges: { create: jest.fn().mockResolvedValue({}).mockReturnValue({ id: "sometestid" }) }
};
