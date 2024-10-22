import mongoose from "mongoose";
import { OrderStatus } from "@nlazzos/gittix-common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// typescript types

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
  __v: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  __v: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  findByEvent(event: { id: string; __v: number }): Promise<OrderDoc | null>;
}

// mongoose types

const orderSchema = new mongoose.Schema<OrderDoc>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    userId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

// find the document with the previous version, to handle concurrency issues when events are coming out of order
orderSchema.statics.findByEvent = (event: { id: string; __v: number }) => {
  return Order.findOne({ _id: event.id, __v: event.__v - 1 });
};

orderSchema.plugin(updateIfCurrentPlugin);

const OrderModel = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

// extending the original model to enforce type validation with typescript
export class Order extends OrderModel {
  constructor(attrs: OrderAttrs) {
    let a: any = { ...attrs };

    // this is because in this service we want to have the order id to match the one in the order service
    if (attrs?.id) {
      a = { _id: attrs.id, ...attrs };
      delete a.id;
    }

    super(a);
  }
}
