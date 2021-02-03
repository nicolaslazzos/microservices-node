import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  __v: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  findByEvent(event: { id: string; __v: number }): Promise<TicketDoc | null>;
}

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


// find the document with the previous version, to handle concurrency issues when events are coming out of order
ticketSchema.statics.findByEvent = (event: { id: string; __v: number }) => {
  return Ticket.findOne({ _id: event.id, __v: event.__v - 1 });
};

ticketSchema.plugin(updateIfCurrentPlugin);

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
