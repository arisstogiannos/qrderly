import { formatCurrency } from "@/lib/formatter";
import { ProductURL } from "@/types";
import { Subscription } from "@prisma/client";
import { Column, Img, Row, Section, Text } from "@react-email/components";



const dateFormatter = Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function OrderInformation({ sub }:{sub: Subscription}) {
  return (
    <>
      <Section>
        <Column>
          <Row >
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Order ID
            </Text>
            <Text className=" mt-0 mr-4">{sub.id}</Text>
          </Row>
          <Row>
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Purchase On
            </Text>
            <Text className=" mt-0 mr-4">
              {dateFormatter.format(sub.purchasedAt)}
            </Text>
          </Row>
          <Row>
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Price Paid
            </Text>
            <Text className=" mt-0 mr-4">
              {formatCurrency(100 / 100)}
            </Text>
          </Row>
          <Row>
            <Text className=" mr-4 text-gray-500 whitespace-nowrap text-nowrap">
              Product
            </Text>
            <Text className=" mt-0 mr-4">
             {sub.product}
            </Text>
          </Row>
        </Column>
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
