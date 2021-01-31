import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {}

const ticketSchema = new mongoose.Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.methods.isReserved = async function () {
  const order = await Order.findOne({
    ticket: this,
    status: {
      $ne: OrderStatus.Cancelled,
    },
  });

  return !!order;
};

const TicketModel = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);

// extending the original model to enforce type validation with typescript
export class Ticket extends TicketModel {
  constructor(attrs: TicketAttrs) {
    let a: any = { ...attrs };

    if (attrs?.id) {
      a = { _id: attrs.id, ...attrs };
      delete a.id;
    }

    super(a);
  }
}
