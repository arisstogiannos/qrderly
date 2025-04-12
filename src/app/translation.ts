"use server";
import { cache } from "@/lib/cache";
import { Language } from "@/types";
import * as deepl from "deepl-node";
const authKey = "90e7ff7d-bb64-4e87-933c-931770bb27c9:fx";
const translator = new deepl.Translator(authKey);

export async function translateTextDeepL(
  text: string,
  srcLang: deepl.SourceLanguageCode,
  targetLang: deepl.TargetLanguageCode,
  context?:string
) {
  const start = new Date().getTime();
  const result = await translator.translateText(text, srcLang, targetLang,{context:context});
  const elapsed = new Date().getTime() - start;
  console.log(elapsed);
  return result.text;
}

export async function translateTextToMultipleDeepL(
  text: string,
  srcLang: deepl.SourceLanguageCode,
  targetLanguages: deepl.TargetLanguageCode[],
  context?:string

) {
  const translationsPromises = targetLanguages.map((l) => {
    const translateTextDeepLCached = cache(
      translateTextDeepL,
      [`${srcLang}-${l}-${text}`],
      { revalidate: 604800,tags:[`${srcLang}-${l}-${text}`] } // Cache for 7 days
    );
    return translateTextDeepLCached(text, srcLang, l,context);
  });
  const translations = await Promise.all(translationsPromises);

  return translations as string[];
}

export async function getSupportedSrcLanguagesDeepL() {
  const result = await translator.getSourceLanguages();
  return result;
}
export async function getSupportedTargetLanguagesDeepL() {
  const result = await translator.getTargetLanguages();
  return result;
}

// export const supportedSrcLanguages = [
//   { name: 'Bulgarian', code: 'bg' },
//   { name: 'Czech', code: 'cs' },
//   { name: 'Danish', code: 'da' },
//   { name: 'German', code: 'de' },
//   { name: 'Greek', code: 'el' },
//   { name: 'English', code: 'en' },
//   { name: 'Spanish', code: 'es' },
//   { name: 'Estonian', code: 'et' },
//   { name: 'Finnish', code: 'fi' },
//   { name: 'French', code: 'fr' },
//   { name: 'Hungarian', code: 'hu' },
//   { name: 'Indonesian', code: 'id' },
//   { name: 'Italian', code: 'it' },
//   { name: 'Japanese', code: 'ja' },
//   { name: 'Korean', code: 'ko' },
//   { name: 'Lithuanian', code: 'lt' },
//   { name: 'Latvian', code: 'lv' },
//   { name: 'Norwegian', code: 'nb' },
//   { name: 'Dutch', code: 'nl' },
//   { name: 'Polish', code: 'pl' },
//   { name: 'Portuguese', code: 'pt' },
//   { name: 'Romanian', code: 'ro' },
//   { name: 'Russian', code: 'ru' },
//   { name: 'Slovak', code: 'sk' },
//   { name: 'Slovenian', code: 'sl' },
//   { name: 'Swedish', code: 'sv' },
//   { name: 'Turkish', code: 'tr' },
//   { name: 'Ukrainian', code: 'uk' },
//   { name: 'Chinese', code: 'zh' }
// ]
export async function translateTextToMultiple(
  text: string,
  srcLang: string,
  languages: string[]
) {
  // const formatedTranslations = [];

  const translationsPromises = languages.map((l) =>
    translateText(text, srcLang, l)
  );
  const translations = await Promise.all(translationsPromises);

  // for(let i= 0; i<translations.length;i++){
  //   formatedTranslations.push(languages[i]+"/+/"+translations[i])
  // }
  //   return formatedTranslations.join("---");
  return translations as string[];
}

export async function getSupportedLanguages() {
  const response = await fetch(`https://lingva.ml/api/v1/languages/`, {
    cache: "force-cache",
  });
  const data = await response.json();
  return data.languages as Language[];
}
export async function translateText(
  text: string,
  srcLang: string,
  targetLang: string
) {
  const start = new Date().getTime();
  const response = await fetch(
    `https://lingva.ml/api/v1/${srcLang}/${targetLang}/${encodeURIComponent(text)}`,
    { cache: "force-cache" }
  );
  const elapsed = new Date().getTime() - start;
  const data = await response.json();
  console.log(elapsed);
  return data.translation;
}
