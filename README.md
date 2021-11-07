# Realtime Game Translation

This was created to translate Cyberpunk 2077 in realtime to english and pinyin
so I can try to learn chinese while playing.

## Usage

1. Clone [tessdata](https://github.com/tesseract-ocr/tessdata) to a directory

> You can also just download only the languages you need, in my case [chi_tra.traineddata](https://github.com/tesseract-ocr/tessdata/blob/main/chi_tra.traineddata)

2. Make sure `tesseract` is installed and `TESSDATA_PREFIX` is set properly

3. Run `yarn start`

## How it works

1. A transparent electron window to displays text.
2. Take a screenshot the game window
3. Run the screenshot through tesseract OCR (neural network)
4. Translate characters via google translate api
5. Convert characters to pinyin using [hanzi-to-pinyin](https://www.npmjs.com/package/hanzi-to-pinyin)
6. Display contents on transparent electron window
