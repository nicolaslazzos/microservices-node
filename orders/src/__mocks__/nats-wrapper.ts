// fake natswrapper implementation to be able to pass the tests without running a nats client

// jest.fn() is a function that we can define to test if a function is actually being called

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
