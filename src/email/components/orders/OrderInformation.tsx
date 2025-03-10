import { formatCurrency } from "@/lib/formatter";
import { Column, Img, Row, Section, Text } from "@react-email/components";

type thisProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
};

const dateFormatter = Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function OrderInformation({ order }: thisProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Order ID
            </Text>
            <Text className=" mt-0 mr-4">{order.id}</Text>
          </Column>
          <Column>
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Purchase On
            </Text>
            <Text className=" mt-0 mr-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Price Paid
            </Text>
            <Text className=" mt-0 mr-4">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
        {/* <Img
          width="100%"
          alt={cart.id}
          src={`http://localhost:3000${product.imagePath}`}
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className=" text-lg font-bold m-0 mr-4">
              {product.name}
            </Text>
          </Column>
         
        </Row>
        <Row className="mt-8">
          
          <Column className="align-bottom">
            <Text className=" text-base  m-0  ">
              {product.description}
            </Text>
          </Column>
        </Row> */}
      </Section>
    </>
  );
}
