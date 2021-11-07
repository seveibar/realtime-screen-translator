const { Translate } = require("@google-cloud/translate").v2

const translate = new Translate({ projectId: process.env.GOOGLE_PROJECT_ID })

export default async (text, { to }) => {
  const [translation] = await translate.translate(text, to)
  return translation
}
