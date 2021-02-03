import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
  const ticket = new Ticket({
    title: "a test ticket",
    price: 10,
    userId: "atestuserid",
  });

  await ticket.save();

  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  firstTicket?.set({ price: 25 });
  await firstTicket?.save();

  secondTicket?.set({ price: 35 });

  try {
    await secondTicket?.save();
  } catch (e) {
    return done();
  }

  throw new Error("should not reach this point");
});

it("increments version number on multiple saves", async () => {
  const ticket = new Ticket({
    title: "a test ticket",
    price: 10,
    userId: "atestuserid",
  });

  await ticket.save();

  expect(ticket.__v).toEqual(0);

  await ticket.save();

  expect(ticket.__v).toEqual(1);

  await ticket.save();

  expect(ticket.__v).toEqual(2);
});
