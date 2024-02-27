type checkoutItemType = {
    id: string;
    price: number;
    images: { id: string; url: string; productId: string; }[];
    name: string;
    categories: string[];
    quantity: number;
}

export default function CheckoutItem(props:checkoutItemType) {
  return (
    <div className="bg-card-bg-color shadow-md rounded-xl p-6 w-full lg:w-96 ">
      <div className="flex items-center justify-start gap-2 mb-4">
        <img src={props.images[0]?.url ?? ""} alt="Item Image" className="object-cover w-24 h-24 rounded-mdaspect-square"/>
        <div className="text-left">
          <h2 className="font-semibold text-xl">{props.name}</h2>
          <p className="text-gray-500">Quantity:  {props.quantity}</p>
          <p className="text-lg font-bold">${props.price}</p>
        </div>
      </div>
    </div>
  )
}
