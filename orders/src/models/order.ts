import mongoose from "mongoose";
import { OrderStatus } from "@nlazzos/gittix-common";

import { TicketDoc } from "./ticket";

// typescript types

interface OrderAttrs {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {}

// mongoose types

const orderSchema = new mongoose.Schema<OrderDoc>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

const OrderModel = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

// extending the original model to enforce type validation with typescript
export class Order extends OrderModel {
  constructor(attrs: OrderAttrs) {
    super(attrs);
  }
}
