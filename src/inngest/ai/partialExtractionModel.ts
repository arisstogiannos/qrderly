import { createPartFromUri, createUserContent, type File, GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function partialExtractionAI(
  uploadedFile: File,
  languages: string[] | undefined,
  existingMenuItemNames: string[],
) {
  let finalResponse = '';

  const forbiddenItemsStr = existingMenuItemNames.map((name) => `"${name}"`).join(', ');

  const work = (async () => {
    const response = await ai.models
      .generateContentStream({
        model: 'gemini-2.0-flash',
        contents: [
          createUserContent([
            createPartFromUri(uploadedFile.uri ?? '', uploadedFile.mimeType ?? ''),
            `
            You are a menu parser AI that creates a digital menu from a physical. The user is giving you an image or PDF of a menu. Your task is to extract only the **new** menu items that are not already present in the user's existing menu. You have to successfully find and return the new items in the menu. The user will provide you with a list of existing menu items that should be excluded from the response. You have to be very accurate and precise in your extraction and translation. 
            
            - IMPORTANT: Do **NOT** include any menu items in your response whose name exactly matches any of the names in the following list: [${forbiddenItemsStr}]
            - If a menu item’s name matches any name in this list, completely skip that item.
            - Return ONLY items that are new (not in the list above).
            - For each returned item, extract name, description, priceInCents, category, categoryDescription, preferences, and translations.
            - For each returned item, you have to accuratly identify in which category it belongs and put the correct category in the category property. It is IMPORTANT to put the product in the right category.
            - It is **IMPORTANT** to return all of the **new** items that there are in the menu and are not included in the list.
            - To ensure you return all of the new items make sure that the number of items in the list and the number of items you return equals the total number of items in the menu.
            - If the input is not a menu, return a JSON array with one object where all fields are "%%%Not a menu%%%".
            - Translate the name and description of all items to the languages with the following codes ${languages?.join(', ')} and include them in the translations field.
            - Ensure that you dont skip translating any name or description that needs translation.
            - The translations should be accurate and contextually relevant as you are a native speaker of each language.
            - Convert all prices to cents.
            - Preferences should include any extras, add-ons, sizes, sides, options, ingredients or variants.
            - Each prefernce value should include only one prefernce and not many with the same price. This ensure that user can select them separately to order.
            - if there are products that users have to assemble the their self by picking ingredients then put the ingredients into prefernces. Example: if the menu item is a crepe and the menu has all the ingredients that can be used then put them in the prefernces field and create a prefernce for each category of ingredients. Example: meat: chicken, beef, pork / cheese: mozzarela, parmezan, feta and so on create a prefernce for each category of ingredients.
            - If category specifies any prefernces or extras include them to the preference of each item that belong to this category. Example 1: If inside the category area there is text saying served with rice or fries you have to add a prefernce to each item of the category like: {name:"side",values:["rice","fries"]}. Example 2: If inside the category area there is text saying add bacon +1.50 , add egg or whatever looks like an option include it as well in prefences like: {name:"extras",values:["bacon +150","egg"]} . Example 3: If inside the category area there is text saying add syrop, chocolate chips or caramel +3.90 whatever looks like an option include it as well in prefences like: {name:"extras",values:["syrop + 390","chocolate chips +390", "caramel +390"]}.
            - Any extra price that comes along with selecting a prefernce put it in the prfernce value price field and dont include in the prefernce value name.
            - In the prefernce price field should be only the extra price that is added and not the final price.
            - Skip decoration pages that doesnt include any menu items
`,
          ]),
        ],
        config: {
          systemInstruction: `Your task is to extract menu items from a scanned menu file so a digital menu can be created. Users will be able to order from the menu so you have to do be extremely accurate while extracting the info. Do not include any item whose name exactly matches any name in the following list: [${forbiddenItemsStr}]. Its really important not to include any of these items in the response so we dont have duplicates. Then you have to accurately translate the menu items to the languages specified in the request.`,

          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  nullable: false,
                  description: 'The name of the product that isnt included in the forbiden list.',
                },
                description: {
                  type: Type.STRING,
                  nullable: true,
                  description:
                    'The description of the product that isnt included in the forbiden list.',
                },
                priceInCents: {
                  type: Type.NUMBER,
                  nullable: false,
                  description:
                    'The price of the product that isnt included in the forbiden list. in cents',
                },
                category: {
                  type: Type.STRING,
                  nullable: false,
                  description:
                    'The category the product that isnt included in the forbiden list. belongs to',
                },
                categoryDescription: {
                  type: Type.STRING,
                  nullable: false,
                  description:
                    'Describe the category of the product that isnt included in the forbiden list. with a few words to provide context to translation ai',
                },
                translations: {
                  type: Type.ARRAY,
                  nullable: false,
                  description:
                    'Translations of the product that isnt included in the forbiden list. details in different languages.',

                  items: {
                    type: Type.OBJECT,
                    properties: {
                      languageCode: {
                        type: Type.STRING,
                        nullable: false,
                        description: 'The language code of the translation, e.g. en, fr, es',
                      },
                      name: {
                        type: Type.STRING,
                        nullable: true,
                        description:
                          'The name of the product that isnt included in the forbiden list. in the target language',
                      },
                      description: {
                        type: Type.STRING,
                        nullable: true,
                        description:
                          'The description of the product that isnt included in the forbiden list. in the target language',
                      },
                    },
                    required: ['languageCode', 'name', 'description'],
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
                          'The name of the prefernce, e.g sugar:sweet,medium,none the prefernce name is sugar',
                      },
                      type: {
                        type: Type.STRING,
                        nullable: false,
                        enum: ['single', 'multiple'],
                        description:
                          'The type of the prefernce is single or multiple. If it is not clear from the menu you can assume it is single',
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
                                'The name of the prefernce value, e.g sugar:sweet the prefernce value name is sweet',
                            },
                            price: {
                              type: Type.NUMBER,
                              nullable: false,
                              description:
                                'The extra price that is added to the mrnuitem if the user select this prefernce in cents',
                            },
                          },
                        },
                        description:
                          'The values of the prefernce, e.g sugar:sweet,medium,none the prefernce values are sweet,meduim,none',
                      },
                    },
                  },
                  description:
                    'The options or extras the customers can specify when ordering the product that isnt included in the forbiden list.. This can be options or prefernces of the item itself or from the category that th item belongs to.',
                },
              },
              required: ['name', 'priceInCents', 'category', 'categoryDescription', 'translations'],
            },
          },
        },
      })
      .catch((err) => {
        console.error('Ai Overloaded: ', err);
        return {
          error:
            'Our Ai is overloaded right now. Please try again in a few seconds. If the problem persists try again later.',
        };
      });
    if ('error' in response) return response;
    for await (const chunk of response) {
      finalResponse += chunk.text;
    }
    return finalResponse;
  })();

  return await Promise.race<string | { error: string }>([
    work,
    new Promise<string>((resolve) => setTimeout(() => resolve(finalResponse), 49000)),
  ]);
}
