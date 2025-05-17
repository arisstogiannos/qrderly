import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
  File,
  Type,
  GenerateContentResponse,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export async function extractAI(
  uploadedFile: File,
  languages: string[] | undefined
) {
  let finalResponse = "";

  const work = (async () => {
    const response = await ai.models
      .generateContentStream({
        model: "gemini-2.0-flash",
        contents: [
          createUserContent([
            createPartFromUri(
              uploadedFile.uri ?? "",
              uploadedFile.mimeType ?? ""
            ),

            `Extract all menu items and categories from the provided image or pdf and structure them in the JSON format below to create a digital menu from a physical.
                  
                  - If the provided image or pdf is NOT a MENU your response should be %%%Not a menu%%% in all fields of the json (important).
                  - The name and description of each item should be in the original language.
                  - Identify all menu items and categorize them properly using the categories in the menu.
                  - Preferences are any extras, add-ons, sizes, options, sides ingredients or variants.
                  - Make sure you dont get confused with prefernces and descriptions of items. Distinguise them accuratly.
                  - Any extra price that comes along with selecting a prefernce put it in the prfernce value price field and dont include in the prefernce value name.
                  - Each prefernce value should include only one prefernce and not many with the same price. This ensure that user can select them separately to order.
                  - In the prefernce price field should be onlly the extra price that is added and not the final price. 
                  - If category specifies any prefernces include them to the preference of each item that belong to this category. Example 1: If inside the category area there is text saying served with rice or fries you have to add a prefernce to each item of the category like: {name:"side",values:["rice","fries"]}. Example 2: If inside the category area there is text saying add bacon +1.50 , add egg or whatever looks like an option include it as well in prefences like: {name:"extras",values:["bacon +150","egg"]} . Example 3: If inside the category area there is text saying add syrop, chocolate chips or caramel +3.90 whatever looks like an option include it as well in prefences like: {name:"extras",values:["syrop + 390","chocolate chips +390", "caramel +390"]}
                  - if there are products that users have to assemble the their self by picking ingredients then put the ingredients into prefernces. Example: if the menu item is a crepe and the menu has all the ingredients that can be used then put them in the prefernces field and create a prefernce for each category of ingredients. Example: meat: chicken, beef, pork / cheese: mozzarela, parmezan, feta and so on create a prefernce for each category of ingredients.
                  - If any description or preferences are missing, return them as null.
                  - Ensure you dont skip any items.
                  - Translate the name and description of all items to the languages with the following codes ${languages?.join(", ")} and include them in the translations field.
                  - Ensure that you dont skip translating any name or description that needs translation.
                  - The translations should be accurate and contextually relevant as you are a native speaker of each language.
                  - Convert all prices to cents (remove symbols like "$").
                  - Ensure the output strictly follows the JSON structure. Make sure the json output is well formated so it can be parsed by JSON.parse() later.
                  - If You reach your response token limit you have to return a response that is a valid array of json objects. So just remove the last menu item and properly close the json array.
                  - Ignore non-menu text such as restaurant names or disclaimers.
                  - Skip decoration pages that doesnt include any menu items
                  `,
          ]),
        ],
        config: {
          systemInstruction:
            "You are an AI designed to extract structured menu data from images or pdf of restaurant,bar or cafeteria menus so a digital menu can be created. Users will be able to order from the menu so you have to do be extremely accurate while extracting the info. Then you have to accurately translate the menu items to the languages specified in the request.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  nullable: false,
                  description: "The name of the product",
                },
                description: {
                  type: Type.STRING,
                  nullable: true,
                  description: "The description of the product",
                },
                priceInCents: {
                  type: Type.NUMBER,
                  nullable: false,
                  description: "The price of the product in cents",
                },
                category: {
                  type: Type.STRING,
                  nullable: false,
                  description: "The category the product belongs to",
                },
                categoryDescription: {
                  type: Type.STRING,
                  nullable: false,
                  description:
                    "Describe the category of the product with a few words to provide context to translation ai",
                },
                translations: {
                  type: Type.ARRAY,
                  nullable: false,
                  description:
                    "Translations of the product details in different languages.",

                  items: {
                    type: Type.OBJECT,
                    properties: {
                      languageCode: {
                        type: Type.STRING,
                        nullable: false,
                        description:
                          "The language code of the translation, e.g. en, fr, es",
                      },
                      name: {
                        type: Type.STRING,
                        nullable: true,
                        description:
                          "The name of the product in the target language",
                      },
                      description: {
                        type: Type.STRING,
                        nullable: true,
                        description:
                          "The description of the product in the target language",
                      },
                    },
                    required: ["languageCode", "name", "description"],
                  },
                },
                // preferences: { type: Type.STRING, nullable: true, description:"The options the customers have when ordering the product" },
                preferences: {
                  type: Type.ARRAY,
                  nullable: true,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING,
                        nullable: false,
                        description:
                          "The name of the prefernce, e.g sugar:sweet,medium,none the prefernce name is sugar",
                      },
                      type: {
                        type: Type.STRING,
                        nullable: false,
                        enum: ["single", "multiple"],
                        description:
                          "The type of the prefernce is single or multiple. If it is not clear from the menu you can assume it is single",
                      },
                      values: {
                        type: Type.ARRAY,
                        nullable: false,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: {
                              type: Type.STRING,
                              nullable: false,
                              description:
                                "The name of the prefernce value, e.g sugar:sweet the prefernce value name is sweet",
                            },
                            price: {
                              type: Type.NUMBER,
                              nullable: false,
                              description:
                                "The extra price that is added to the menu item if the user select this prefernce in cents",
                            },
                          },
                        },
                        description:
                          "The values of the prefernce, e.g sugar:sweet,medium,none the prefernce values are sweet,meduim,none",
                      },
                    },
                  },
                  description:
                    "The options or extras the customers can specify when ordering the product. This can be options or prefernces of the item itself or from the category that th item belongs to.",
                },
              },
              required: [
                "name",
                "priceInCents",
                "category",
                "categoryDescription",
                "translations",
              ],
            },
          },
        },
      })
      .catch((err) => {
        console.error("Ai Overloaded: ", err);
        return {error:"Our Ai is overloaded right now. Please try again in a few seconds. If the problem persists try again later."};
      });
    if ('error' in response) return response;
    for await (const chunk of response) {
      finalResponse += chunk.text;
    }
    return finalResponse;
  })();

  return await Promise.race<string | {error:string}>([
   work,
    new Promise<string>((resolve) => setTimeout(() => resolve(finalResponse), 49000)),
  ]);


}
