import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
  File,
  Type,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function partialExtractionAI(
  uploadedFile: File,
  languages: string[] | undefined,
  existingMenuItemNames: string[]
) {
  const forbiddenItemsStr = existingMenuItemNames
    .map((name) => `"${name}"`)
    .join(", ");

  return await ai.models
    .generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          `
            You are a menu parser AI. The user is giving you an image or PDF of a restaurant menu. Your task is to extract only the **new** menu items that are not already present in the user's existing menu.
            
            - Do **NOT** include any menu items whose name exactly matches any of the names in the following list: [${forbiddenItemsStr}]
            - If a menu item’s name matches any name in this list, completely skip that item.
            - Return ONLY items that are new (not in the list above).
            - For each returned item, extract name, description, priceInCents, category, categoryDescription, preferences, and translations.
            - For each returned item, you have to accuratly identify in which category it belongs and put the correct category in the category property. It is IMPORTANT to put the product in the right category.
            - It is **IMPORTANT** to return all of the **new** items that there are in the menu and are not included in the list.
            - To ensure you return all of the new items make sure that the number of items in the list and the number of items you return equals the total number of items in the menu.
            - If the input is not a menu, return a JSON array with one object where all fields are "%%%Not a menu%%%".
            - The name and description should be in the original language.
            - Translate the name and description of each item to the languages with the following codes ${languages?.join(", ")} and include them in the translations field.
            - The translations should be accurate and contextually relevant.
            - if there are names or descriptions that shouldnt be translated but should be in original language instead null them.
            - Convert all prices to cents.
            - Preferences should include any extras, add-ons, sizes options, or variants.
            - If category specifies any prefernces or extras include them to the preference of each item that belong to this category. Example 1: If inside the category area there is text saying served with rice or fries you have to add a prefernce to each item of the category like: {name:"side",values:["rice","fries"]}. Example 2: If inside the category area there is text saying add bacon +1.50 , add egg or whatever looks like an option include it as well in prefences like: {name:"extras",values:["bacon +150","egg"]} . Example 3: If inside the category area there is text saying add syrop, chocolate chips or caramel +3.90 whatever looks like an option include it as well in prefences like: {name:"extras",values:["syrop + 390","chocolate chips +390", "caramel +390"]}.
            - Any extra price that comes along with selecting a prefernce put it in the prfernce value price field and dont include in the prefernce value name.
            - Keep output strictly JSON parsable. If your response is too long, close the JSON array correctly.
                      `,
          createPartFromUri(
            uploadedFile.uri ?? "",
            uploadedFile.mimeType ?? ""
          ),
        ]),
      ],
      config: {
        systemInstruction: `Your task is to extract menu items from a scanned menu file. Do not include any item whose name exactly matches the forbidden list provided by the user: [${forbiddenItemsStr}]. Than you have to accurately translate the menu items to the languages specified in the request. You have to be very accurate and precise in your translations.`,

        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                nullable: false,
                description:
                  "The name of the product that isnt included in the forbiden list.",
              },
              description: {
                type: Type.STRING,
                nullable: true,
                description:
                  "The description of the product that isnt included in the forbiden list.",
              },
              priceInCents: {
                type: Type.NUMBER,
                nullable: false,
                description:
                  "The price of the product that isnt included in the forbiden list. in cents",
              },
              category: {
                type: Type.STRING,
                nullable: false,
                description:
                  "The category the product that isnt included in the forbiden list. belongs to",
              },
              categoryDescription: {
                type: Type.STRING,
                nullable: false,
                description:
                  "Describe the category of the product that isnt included in the forbiden list. with a few words to provide context to translation ai",
              },
              translations: {
                type: Type.ARRAY,
                nullable: false,
                description:
                  "Translations of the product that isnt included in the forbiden list. details in different languages.",

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
                        "The name of the product that isnt included in the forbiden list. in the target language",
                    },
                    description: {
                      type: Type.STRING,
                      nullable: true,
                      description:
                        "The description of the product that isnt included in the forbiden list. in the target language",
                    },
                  },
                  required: ["languageCode", "name", "description"],
                },
              },
              // preferences: { type: Type.STRING, nullable: true, description:"The options the customers have when ordering the product that isnt included in the forbiden list." },
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
                              "The extra price that is added to the mrnuitem if the user select this prefernce in cents",
                          },
                        },
                      },
                      description:
                        "The values of the prefernce, e.g sugar:sweet,medium,none the prefernce values are sweet,meduim,none",
                    },
                  },
                },
                description:
                  "The options or extras the customers can specify when ordering the product that isnt included in the forbiden list.. This can be options or prefernces of the item itself or from the category that th item belongs to.",
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
      return "Our Ai is overloaded right now. Please try again in a few seconds. If the problem persists try again later.";
    });
}
